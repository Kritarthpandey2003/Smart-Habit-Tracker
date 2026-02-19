import requests
import time

url = "https://smart-habit-tracker-amber.vercel.app/debug-routes"

print(f"Polling {url}...")
for i in range(20):
    try:
        response = requests.get(url, timeout=10)
        print(f"Attempt {i+1}: Status {response.status_code}")
        if response.status_code == 200:
            print("Routes:", response.json())
            break
        elif response.status_code == 404:
            print("404 Not Found (waiting for deployment)")
    except Exception as e:
        print(f"Attempt {i+1}: Error {e}")
    time.sleep(5)
