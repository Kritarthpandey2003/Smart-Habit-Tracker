import requests

urls = [
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent",
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=INVALID_KEY",
    "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=INVALID_KEY"
]

for url in urls:
    print(f"\nURL: {url}")
    try:
        if "?" not in url:
            headers = {'x-goog-api-key': 'INVALID_KEY', 'Content-Type': 'application/json'}
        else:
            headers = {'Content-Type': 'application/json'}
        res = requests.post(url, json={"contents": [{"parts": [{"text":"test"}]}]}, headers=headers)
        print(f"Status: {res.status_code}")
        print(f"Response: {res.text}")
    except Exception as e:
        print(f"Error: {e}")
