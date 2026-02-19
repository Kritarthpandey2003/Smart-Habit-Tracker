from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token
from mock_store import store
from werkzeug.security import generate_password_hash, check_password_hash

bp = Blueprint('auth', __name__, url_prefix='/api/auth')

@bp.route('/register', methods=['POST'])
def register():
    try:
        data = request.get_json()
        username = data.get('username')
        password = data.get('password')

        if not username or not password:
            return jsonify({"message": "Username and password are required"}), 400

        # Check if user exists
        if store.get_user_by_username(username):
            return jsonify({"message": "Username already exists"}), 400

        # Create user
        new_user = {
            "username": username,
            "password_hash": generate_password_hash(password)
        }
        store.add_user(new_user)
        
        return jsonify({"message": "User registered successfully (Mock Mode)"}), 201

    except Exception as e:
        print(f"Registration Error: {str(e)}")
        return jsonify({
            "message": "Registration failed",
            "error": str(e)
        }), 500

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    user = store.get_user_by_username(username)

    if user and check_password_hash(user['password_hash'], password):
        access_token = create_access_token(identity=str(user['id']))
        return jsonify(access_token=access_token), 200

    return jsonify({"message": "Invalid credentials"}), 401
