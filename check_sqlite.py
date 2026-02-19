import requests
import time

url = "https://smart-habit-tracker-amber.vercel.app/api/debug/sqlite"

print(f"Polling {url}...")
for i in range(10):
    try:
        response = requests.get(url, timeout=10)
        print(f"Attempt {i+1}: Status {response.status_code}")
        if response.status_code == 200:
            print("Body:", response.text)
            break
        elif response.status_code != 404:
             print("Body:", response.text[:500])
             if response.status_code >= 500: # Wait/retry if crashing
                 pass 
    except Exception as e:
        print(f"Attempt {i+1}: Error {e}")
    time.sleep(3)
