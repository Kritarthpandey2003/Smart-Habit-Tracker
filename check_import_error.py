import requests
import time

url = "https://smart-habit-tracker-amber.vercel.app/import-error"
ping_url = "https://smart-habit-tracker-amber.vercel.app/api/ping"

print(f"Polling {url}...")
for i in range(20):
    try:
        response = requests.get(url, timeout=10)
        print(f"Attempt {i+1} (Import Error): Status {response.status_code}")
        if response.status_code == 200 or response.status_code == 500:
             print("Body:", response.text)
             if "Import Error" in response.text:
                 break
        
        # Also check ping
        ping_resp = requests.get(ping_url, timeout=5)
        print(f"Attempt {i+1} (Ping): Status {ping_resp.status_code}")
        if ping_resp.status_code == 200:
            print("Ping Success:", ping_resp.json())
            break

    except Exception as e:
        print(f"Attempt {i+1}: Error {e}")
    time.sleep(5)
