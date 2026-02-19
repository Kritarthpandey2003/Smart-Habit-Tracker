import requests
import json

base_url = "https://smart-habit-tracker-amber.vercel.app/api"

endpoints = [
    ("/debug/health", "GET", None),
    ("/debug/db", "GET", None),
    ("/auth/register", "POST", {"username": "debugCheck1", "password": "pwd"})
]

with open("debug_output_v2.txt", "w", encoding="utf-8") as f:
    for path, method, data in endpoints:
        url = base_url + path
        f.write(f"--- Testing {method} {url} ---\n")
        try:
            if method == "GET":
                response = requests.get(url)
            else:
                response = requests.post(url, json=data, headers={"Content-Type": "application/json"})
            
            f.write(f"Status: {response.status_code}\n")
            f.write(f"Body: {response.text[:500]}\n") # limit output
        except Exception as e:
            f.write(f"Error: {e}\n")
        f.write("\n")
