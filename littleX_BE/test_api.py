import requests
import json
import time

BASE_URL = "http://127.0.0.1:8000"

def test_api():
    email = f"test_user_{int(time.time())}@example.com"
    password = "password123"
    
    # 1. Register
    print("Registering...")
    res = requests.post(f"{BASE_URL}/user/register", json={"email": email, "password": password})
    print(f"Register status: {res.status_code}")
    print(f"Register body: {res.text[:500]}")
    
    # 2. Login
    print("\nLogging in...")
    res = requests.post(f"{BASE_URL}/user/login", json={"email": email, "password": password})
    print(f"Login status: {res.status_code}")
    login_data = res.json()
    if "reports" in login_data:
        login_data = login_data["reports"][0]
    
    token = login_data.get("token")
    print(f"Token: {token[:10]}...")
    
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    
    # 3. Create Tweet
    print("\nCreating tweet...")
    res = requests.post(f"{BASE_URL}/walker/create_tweet", headers=headers, json={"content": "Hello LittleX from script!"})
    print(f"Create tweet status: {res.status_code}")
    print(f"Create tweet body: {res.text[:500]}")
    
    # 4. Load Feed
    print("\nLoading feed...")
    res = requests.post(f"{BASE_URL}/walker/load_feed", headers=headers, json={"search": ""})
    print(f"Load feed status: {res.status_code}")
    print(f"Load feed body: {res.text[:500]}")
    
    feed_data = res.json()
    if "reports" in feed_data:
        tweets = feed_data["reports"][0]
        print(f"Received {len(tweets)} tweets in feed.")
        for idx, t_entry in enumerate(tweets):
            t_info = t_entry.get("Tweet_Info", {})
            print(f"  {idx}. Content: {t_info.get('content')}")

if __name__ == "__main__":
    test_api()
