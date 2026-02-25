from flask import Blueprint, request, jsonify
from mock_store import store
from flask_jwt_extended import jwt_required, get_jwt_identity
import os

bp = Blueprint('coach', __name__, url_prefix='/api/coach')

@bp.route('/chat', methods=['POST'])
@jwt_required()
def chat():
    current_user_id = int(get_jwt_identity())
    user = store.get_user_by_id(current_user_id)
    data = request.get_json()
    user_message = data.get('message', '')
    
    # Handle missing user in Mock Mode due to Vercel Serverless cold starts
    username = user['username'] if user else f"User {current_user_id}"
    
    # Gather context
    habits = store.get_habits_by_user(current_user_id)
    context = f"User: {username}.\nHabits:\n"
    for h in habits:
        context += f"- {h['name']} ({h['frequency']}): {h['description']}\n"
        completed_count = store.get_completed_count(h['id'])
        context += f"  - Completed {completed_count} times total.\n"

    system_prompt = (
        "You are a supportive, tailored habit coaching AI. "
        "Your goal is to help the user stick to their habits, offer advice, and verify their progress. "
        "Keep responses concise and motivating."
    )

    gemini_api_key = os.getenv('GEMINI_API_KEY')

    # Removed OpenAI logic due to 'Client.__init__() got unexpected keyword argument proxies'
    # in Vercel serverless environment with openai v1.30.1.
    if gemini_api_key:
        try:
            import requests
            url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent"
            payload = {
                "contents": [{
                    "parts": [{"text": f"System Instruction: {system_prompt}\n\nContext:\n{context}\n\nUser Message: {user_message}"}]
                }]
            }
            headers = {
                'Content-Type': 'application/json',
                'x-goog-api-key': gemini_api_key
            }
            res = requests.post(url, json=payload, headers=headers)
            res.raise_for_status()
            data = res.json()
            reply = data['candidates'][0]['content']['parts'][0]['text']
        except Exception as e:
            print(f"Gemini API Exception: {e}")
            reply = f"[DEBUG] Gemini REST API failed. Error: {str(e)}"
    else:
        # Mock response
        reply = (
            "I see you're working on your habits! "
            "(Note: No AI API Key configured, this is a mock response). "
            f"You have {len(habits)} active habits. Keep it up!"
        )

    return jsonify({"reply": reply})

