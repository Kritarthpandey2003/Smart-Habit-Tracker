from flask import Blueprint, request, jsonify
from extensions import db, jwt
from models import User
from flask_jwt_extended import create_access_token

bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return jsonify({"message": "Username and password are required"}), 400

        # Check if user exists (moved inside try/catch to handle DB errors)
        if User.query.filter_by(username=username).first():
            return jsonify({"message": "Username already exists"}), 400

        new_user = User(username=username)
        new_user.set_password(password)
        
        db.session.add(new_user)
        db.session.commit()
        
        return jsonify({"message": "User registered successfully"}), 201

    except Exception as e:
        db.session.rollback()
        print(f"Registration Error: {str(e)}") # Log for server logs
        import traceback
        traceback.print_exc() # Print full stack trace to Vercel logs
        return jsonify({
            "message": "Registration failed",
            "error": str(e),
            "type": type(e).__name__
        }), 500

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = User.query.filter_by(username=username).first()

    if user and user.check_password(password):
        access_token = create_access_token(identity=str(user.id))
        return jsonify(access_token=access_token), 200

    return jsonify({"message": "Invalid credentials"}), 401
