from flask import Blueprint, request, jsonify
from extensions import db
from models import Habit, HabitLog
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

bp = Blueprint('habits', __name__, url_prefix='/api/habits')

@bp.route('', methods=['GET'])
@jwt_required()
def get_habits():
    current_user_id = get_jwt_identity()
    habits = Habit.query.filter_by(user_id=current_user_id).all()
    
    result = []
    for habit in habits:
        habit_data = habit.to_dict()
        # Include logs for the last 30 days or so, for now include all
        logs = [log.to_dict() for log in habit.logs]
        habit_data['logs'] = logs
        result.append(habit_data)
        
    return jsonify(result), 200

@bp.route('', methods=['POST'])
@jwt_required()
def create_habit():
    current_user_id = get_jwt_identity()
    data = request.get_json()
    
    name = data.get('name')
    if not name:
        return jsonify({"message": "Name is required"}), 400
        
    new_habit = Habit(
        user_id=current_user_id,
        name=name,
        description=data.get('description', ''),
        frequency=data.get('frequency', 'daily')
    )
    
    db.session.add(new_habit)
    db.session.commit()
    
    return jsonify(new_habit.to_dict()), 201

@bp.route('/<int:habit_id>', methods=['DELETE'])
@jwt_required()
def delete_habit(habit_id):
    current_user_id = int(get_jwt_identity())
    habit = Habit.query.get_or_404(habit_id)
    
    if habit.user_id != current_user_id:
        return jsonify({"message": "Unauthorized"}), 403
        
    db.session.delete(habit)
    db.session.commit()
    
    return jsonify({"message": "Habit deleted"}), 200

@bp.route('/<int:habit_id>/log', methods=['POST'])
@jwt_required()
def log_habit(habit_id):
    current_user_id = int(get_jwt_identity())
    habit = Habit.query.get_or_404(habit_id)
    
    if habit.user_id != current_user_id:
        return jsonify({"message": "Unauthorized"}), 403
        
    data = request.get_json()
    date_str = data.get('date')
    status = data.get('status', True)
    
    if not date_str:
        return jsonify({"message": "Date is required"}), 400
        
    try:
        log_date = datetime.fromisoformat(date_str).date()
    except ValueError:
        return jsonify({"message": "Invalid date format"}), 400
        
    # Check if log exists
    log = HabitLog.query.filter_by(habit_id=habit_id, date=log_date).first()
    
    if log:
        log.status = status
    else:
        log = HabitLog(habit_id=habit_id, date=log_date, status=status)
        db.session.add(log)
        
    db.session.commit()
    
    return jsonify(log.to_dict()), 200
