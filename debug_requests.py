import requests
import json

url = "https://smart-habit-tracker-amber.vercel.app/api/auth/register"
payload = {"username": "debuguser_v3", "password": "debugpassword"}
headers = {"Content-Type": "application/json"}

try:
    with open("debug_output.txt", "w", encoding="utf-8") as f:
        f.write(f"Sending POST to {url}\n")
        response = requests.post(url, json=payload, headers=headers)
        f.write(f"Status Code: {response.status_code}\n")
        f.write("Response Headers:\n")
        for k, v in response.headers.items():
            f.write(f"  {k}: {v}\n")
        f.write("\nResponse Body:\n")
        f.write(response.text)
except Exception as e:
    with open("debug_output.txt", "w", encoding="utf-8") as f:
        f.write(f"Error: {e}")
