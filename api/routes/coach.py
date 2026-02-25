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

    openai_api_key = os.getenv('OPENAI_API_KEY')
    gemini_api_key = os.getenv('GEMINI_API_KEY')

    if openai_api_key:
        try:
            from openai import OpenAI
            client = OpenAI(api_key=openai_api_key)
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
            reply = f"[DEBUG] OpenAI API failed. Error: {str(e)}"
    elif gemini_api_key:
        try:
            import google.generativeai as genai
            genai.configure(api_key=gemini_api_key)
            model = genai.GenerativeModel('gemini-1.5-flash')
            prompt = f"System Instruction: {system_prompt}\n\nContext:\n{context}\n\nUser Message: {user_message}"
            response = model.generate_content(prompt)
            reply = response.text
        except Exception as e:
            print(f"Gemini Error: {e}")
            reply = f"[DEBUG] Gemini API failed. Error: {str(e)}"
    else:
        # Mock response
        reply = (
            "I see you're working on your habits! "
            "(Note: No AI API Key configured, this is a mock response). "
            f"You have {len(habits)} active habits. Keep it up!"
        )

    return jsonify({"reply": reply})

