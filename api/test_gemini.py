import os
import google.generativeai as genai

gemini_api_key = os.getenv('GEMINI_API_KEY')
print(f"API Key present: {bool(gemini_api_key)}")

if gemini_api_key:
    try:
        genai.configure(api_key=gemini_api_key)
        model = genai.GenerativeModel('gemini-1.5-flash')
        prompt = "Hello, how are you?"
        response = model.generate_content(prompt)
        print("Success:")
        print(response.text)
    except Exception as e:
        print(f"Gemini Error: {e}")
        import traceback
        traceback.print_exc()
else:
    print("No API Key found in environment variables.")
