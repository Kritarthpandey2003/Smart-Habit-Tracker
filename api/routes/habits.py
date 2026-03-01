from flask import Blueprint, request, jsonify
from mock_store import store
from flask_jwt_extended import jwt_required, get_jwt_identity
from datetime import datetime

bp = Blueprint('habits', __name__, url_prefix='/api/habits')

@bp.route('', methods=['GET'])
@jwt_required()
def get_habits():
    current_user_id = get_jwt_identity()
    habits = store.get_habits_by_user(current_user_id)
    
    result = []
    for habit in habits:
        # Include logs
        logs = store.get_logs_by_habit(habit['id'])
        habit['logs'] = logs
        result.append(habit)
        
    return jsonify(result), 200

@bp.route('', methods=['POST'])
@jwt_required()
def create_habit():
    try:
        current_user_id = get_jwt_identity()
        try:
            current_user_id = int(current_user_id)
        except (ValueError, TypeError):
            pass
        data = request.get_json()
        
        name = data.get('name')
        if not name:
            return jsonify({"message": "Name is required"}), 400
            
        new_habit = {
            "user_id": current_user_id,
            "name": name,
            "description": data.get('description', ''),
            "frequency": data.get('frequency', 'daily'),
            "recurrence_days": data.get('recurrenceDays', ''),
            "reminder_time": data.get('reminderTime', '')
        }
        
        created_habit = store.add_habit(new_habit)
        created_habit['logs'] = []
        
        return jsonify(created_habit), 201
    except Exception as e:
        print(f"Create Habit Error: {str(e)}")
        return jsonify({"message": str(e)}), 500

@bp.route('/<int:habit_id>', methods=['DELETE'])
@jwt_required()
def delete_habit(habit_id):
    current_user_id = int(get_jwt_identity())
    habit = store.get_habit(habit_id)
    
    if not habit:
        return jsonify({"message": "Habit not found"}), 404
    
    if habit['user_id'] != current_user_id:
        return jsonify({"message": "Unauthorized"}), 403
        
    store.delete_habit(habit_id)
    
    return jsonify({"message": "Habit deleted"}), 200

@bp.route('/<int:habit_id>/log', methods=['POST'])
@jwt_required()
def log_habit(habit_id):
    current_user_id = int(get_jwt_identity())
    habit = store.get_habit(habit_id)
    
    if not habit:
        return jsonify({"message": "Habit not found"}), 404
        
    if habit['user_id'] != current_user_id:
        return jsonify({"message": "Unauthorized"}), 403
        
    data = request.get_json()
    date_str = data.get('date')
    status = data.get('status', True)
    
    if not date_str:
        return jsonify({"message": "Date is required"}), 400
        
    # Check if log exists
    existing_logs = store.get_logs_by_habit(habit_id)
    log = next((l for l in existing_logs if l['date'] == date_str), None)
    
    if log:
        log['status'] = status
    else:
        log = {
            "habit_id": habit_id,
            "date": date_str,
            "status": status
        }
        store.add_log(log)
        
    return jsonify(log), 200
