import requests
import json

url = "https://smart-habit-tracker-amber.vercel.app/api/auth/register"
payload = {"username": "debuguser_check", "password": "pwm"}
headers = {"Content-Type": "application/json"}

try:
    print(f"Testing {url}")
    response = requests.post(url, json=payload, headers=headers)
    print(f"Status: {response.status_code}")
    print("Body:", response.text)
except Exception as e:
    print(f"Error: {e}")
