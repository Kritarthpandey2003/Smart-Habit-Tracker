from flask import Flask
from flask_cors import CORS
from extensions import db, jwt

app = Flask(__name__)
CORS(app)

from werkzeug.exceptions import HTTPException

@app.errorhandler(Exception)
def handle_exception(e):
    if isinstance(e, HTTPException):
        return e
    return {"message": f"Global Error: {str(e)}"}, 500

import os

# Configuration
if os.environ.get('VERCEL_REGION') or os.environ.get('VERCEL'):
    # Vercel (read-only filesystem, use /tmp)
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:////tmp/habits.db'
else:
    # Local
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///habits.db'
    
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['JWT_SECRET_KEY'] = 'super-secret-key'  # Change this in production!

db.init_app(app)
jwt.init_app(app)

# Import routes
from routes import auth, habits, coach
app.register_blueprint(auth.bp)
app.register_blueprint(habits.bp)
app.register_blueprint(coach.bp)

@app.route('/')
def index():
    return {"message": "Smart Habit Tracker API is running!"}

@app.route('/debug')
def debug():
    import os
    return {
        "db_uri": app.config['SQLALCHEMY_DATABASE_URI'],
        "is_vercel": bool(os.environ.get('VERCEL')),
        "cwd": os.getcwd(),
        "tmp_exists": os.path.exists('/tmp')
    }

# Create tables in /tmp on Vercel startup
with app.app_context():
    import models
    db.create_all()

if __name__ == '__main__':
    with app.app_context():
        import models  # Import models to ensure they are registered with SQLAlchemy
        db.create_all()
    app.run(debug=True, port=5000)
