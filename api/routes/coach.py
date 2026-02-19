from flask import Blueprint, request, jsonify
from mock_store import store
import os
from openai import OpenAI

bp = Blueprint('coach', __name__, url_prefix='/api/coach')

# Initialize OpenAI client if key is present
api_key = os.getenv('OPENAI_API_KEY')
client = OpenAI(api_key=api_key) if api_key else None

@bp.route('/chat', methods=['POST'])
@jwt_required()
def chat():
    current_user_id = int(get_jwt_identity())
    user = store.get_user_by_id(current_user_id)
    data = request.get_json()
    user_message = data.get('message', '')
    
    # Gather context
    habits = store.get_habits_by_user(current_user_id)
    context = f"User: {user['username']}.\nHabits:\n"
    for h in habits:
        context += f"- {h['name']} ({h['frequency']}): {h['description']}\n"
        # Add recent logs if needed
        completed_count = store.get_completed_count(h['id'])
        context += f"  - Completed {completed_count} times total.\n"

    system_prompt = (
        "You are a supportive, tailored habit coaching AI. "
        "Your goal is to help the user stick to their habits, offer advice, and verify their progress. "
        "Keep responses concise and motivating."
    )

    if client:
        try:
            response = client.chat.completions.create(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": f"Context:\n{context}\n\nUser Message: {user_message}"}
                ]
            )
            reply = response.choices[0].message.content
        except Exception as e:
            print(f"OpenAI Error: {e}")
            reply = "I'm having trouble connecting to my brain right now, but keep going! You're doing great."
    else:
        # Mock response
        reply = (
            "I see you're working on your habits! "
            "(Note: OpenAI API Key not configured, this is a mock response). "
            f"You have {len(habits)} active habits. Keep it up!"
        )

    return jsonify({"reply": reply})
