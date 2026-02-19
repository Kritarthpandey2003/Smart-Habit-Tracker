import requests
import time

url = "https://smart-habit-tracker-amber.vercel.app/api/debug/db"

print(f"Polling {url}...")
for i in range(10):
    try:
        response = requests.get(url, timeout=10)
        print(f"Attempt {i+1}: Status {response.status_code}")
        if response.status_code != 404: # Wait for deployment to pickup new route
            print("Body:", response.text[:1000])
            if response.status_code == 200:
                break
    except Exception as e:
        print(f"Attempt {i+1}: Error {e}")
    time.sleep(3)
