from flask import Blueprint, jsonify
from extensions import db
from sqlalchemy import text
import os

bp = Blueprint('debug', __name__, url_prefix='/api/debug')

@bp.route('/health', methods=['GET'])
def health():
    return jsonify({
        "status": "healthy",
        "env": os.environ.get('VERCEL_ENV', 'local'),
        "region": os.environ.get('VERCEL_REGION', 'local')
    }), 200

@bp.route('/db', methods=['GET'])
def check_db():
    try:
        # Check if we can connect
        with db.engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            
        # Check if tables exist
        tables = db.metadata.tables.keys()
        
        # Check specific User table presence in actual DB
        user_count = -1
        try:
            from models import User
            user_count = User.query.count()
        except Exception as e:
            user_count = str(e)

        return jsonify({
            "status": "connected",
            "db_url": str(db.engine.url), # Be careful not to expose passwords if using real DB, but sqlite is safe
            "tables": list(tables),
            "user_count_or_error": user_count
        }), 200
    except Exception as e:
        return jsonify({
            "status": "error",
            "error": str(e)
        }), 500

@bp.route('/sqlite', methods=['GET'])
def check_sqlite():
    import sqlite3
    try:
        conn = sqlite3.connect(':memory:')
        cursor = conn.cursor()
        cursor.execute('SELECT 1')
        result = cursor.fetchone()
        conn.close()
        return jsonify({"status": "ok", "result": result[0], "version": sqlite3.sqlite_version})
    except Exception as e:
        return jsonify({"status": "error", "error": str(e)}), 500
