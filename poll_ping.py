import requests
import time

url = "https://smart-habit-tracker-amber.vercel.app/api/ping"

print(f"Polling {url}...")
for i in range(10):
    try:
        response = requests.get(url, timeout=5)
        print(f"Attempt {i+1}: Status {response.status_code}")
        if response.status_code == 200:
            print("Response:", response.text)
            break
    except Exception as e:
        print(f"Attempt {i+1}: Error {e}")
    time.sleep(2)
