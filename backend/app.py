from flask import Flask
from flask_cors import CORS
from extensions import db, jwt

app = Flask(__name__)
CORS(app)

# Configuration
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

if __name__ == '__main__':
    with app.app_context():
        import models  # Import models to ensure they are registered with SQLAlchemy
        db.create_all()
    app.run(debug=True, port=5000)
