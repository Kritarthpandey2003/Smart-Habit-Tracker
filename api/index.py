import sys
import os

# Add the current directory to sys.path to ensure local imports work on Vercel
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

from flask import Flask, jsonify
from flask_cors import CORS
from extensions import jwt
# from extensions import db # No DB in Mock Mode

app = Flask(__name__)
CORS(app)

from werkzeug.exceptions import HTTPException

@app.errorhandler(Exception)
def handle_exception(e):
    # Pass through HTTP errors to allow custom handling if needed, 
    # BUT convert them to JSON if they are generic standard errors like 500
    if isinstance(e, HTTPException):
        response = e.get_response()
        # replace the body with JSON
        response.data = jsonify({
            "code": e.code,
            "name": e.name,
            "message": e.description,
        }).data
        response.content_type = "application/json"
        return response
    
    # Non-HTTP exceptions (crashes)
    print(f"Global Error: {str(e)}") # Log to Vercel console
    return jsonify({
        "code": 500,
        "name": type(e).__name__,
        "message": str(e)
    }), 500

import os

# Configuration
# Mock Mode - No DB Config needed
# app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:' 
    
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'super-secret-key'  # Change this in production!

# db.init_app(app) # Disable DB
jwt.init_app(app)

# Import routes
# Import routes
try:
    from routes import auth, habits, coach, debug
    app.register_blueprint(auth.bp)
    app.register_blueprint(habits.bp)
    app.register_blueprint(coach.bp)
    app.register_blueprint(debug.bp)
except Exception as e:
    print(f"Import Error: {e}")
    import traceback
    traceback.print_exc()
    @app.route('/api/import-error')
    def import_error():
        return jsonify({"message": "Import Error", "error": str(e), "trace": traceback.format_exc()}), 500

@app.route('/')
def index():
    return {"message": "Smart Habit Tracker API is running (Mock Mode)!"}

@app.route('/api/ping')
def ping():
    return jsonify({
        "message": "Pong", 
        "env": str(os.environ.get('VERCEL_ENV')), 
        "mode": "mock",
        "routes": str(app.url_map)
    })

@app.route('/debug-routes')
def debug_routes():
    return jsonify({"routes": str(app.url_map)})

@app.route('/<path:subpath>')
def catch_all(subpath):
    return jsonify({"message": "Catch All", "path": subpath, "url_map": str(app.url_map)})

# Helper to ensure DB exists
# def init_db():
#     try:
#         with app.app_context():
#             import models
#             db.create_all()
#     except Exception as e:
#         print(f"Error creating DB: {e}")
#         # On Vercel, this might fail if /tmp is not writable or other issues,
#         # but usually it's fine. We want to know IF it failed.

# Initialize DB on start (protected)
if os.environ.get('VERCEL_REGION') or os.environ.get('VERCEL'):
    # In Vercel, we can't rely on global execution being clean
    # We will do it lazily or just try-catch it
    # init_db()  <-- Commented out to debug startup crash
    pass

if __name__ == '__main__':
    # with app.app_context():
    #     import models  # Import models to ensure they are registered with SQLAlchemy
    #     db.create_all()
    app.run(debug=True, port=5000)
