from flask import Blueprint, jsonify
import os
# from extensions import db
# from models import User

bp = Blueprint('debug', __name__, url_prefix='/api/debug')

@bp.route('/health', methods=['GET'])
def health_check():
    return jsonify({
        "status": "healthy",
        "env": os.environ.get('VERCEL_ENV', 'local'),
        "region": os.environ.get('VERCEL_REGION', 'local')
    }), 200

@bp.route('/db', methods=['GET'])
def check_db():
    return jsonify({"message": "DB check disabled in Mock Mode"}), 200

@bp.route('/sqlite', methods=['GET'])
def check_sqlite():
    return jsonify({"message": "SQLite check disabled in Mock Mode"}), 200
