import requests
import time

url = "https://smart-habit-tracker-amber.vercel.app/api/ping"

print(f"Polling {url}...")
for i in range(20):
    try:
        response = requests.get(url, timeout=10)
        print(f"Attempt {i+1}: Status {response.status_code}")
        if response.status_code == 200:
            data = response.json()
            if "routes" in data:
                print("Routes found!")
                with open('routes.txt', 'w') as f:
                    f.write(data["routes"])
                break
            else:
                 print("Waiting for routes in response...")
    except Exception as e:
        print(f"Attempt {i+1}: Error {e}")
    time.sleep(5)
