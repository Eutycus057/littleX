import requests
import json
import time
import datetime

BASE_URL = "http://127.0.0.1:8000"

def test_analytics():
    email = f"analytics_test_{int(time.time())}@example.com"
    password = "password123"
    
    # 1. Register
    print("Registering...")
    res = requests.post(f"{BASE_URL}/user/register", json={"email": email, "password": password})
    print(f"Register status: {res.status_code}")
    
    # 2. Login
    print("\nLogging in...")
    res = requests.post(f"{BASE_URL}/user/login", json={"email": email, "password": password})
    login_data = res.json()
    if "reports" in login_data:
        login_data = login_data["reports"][0]
    
    token = login_data.get("token")
    headers = {"Authorization": f"Bearer {token}", "Content-Type": "application/json"}
    
    # 3. Create Tweets
    print("\nCreating tweets...")
    for i in range(5):
        requests.post(f"{BASE_URL}/walker/create_tweet", headers=headers, json={"content": f"Test tweet {i}"})
        time.sleep(0.5)
    
    # 4. Get Tweets to get their IDs
    print("\nLoading feed...")
    res = requests.post(f"{BASE_URL}/walker/load_feed", headers=headers, json={"search": ""})
    feed = res.json()["reports"][0]
    if feed:
        print(f"First feed entry: {json.dumps(feed[0], indent=2)}")
    tweet_ids = [t["Tweet_Info"]["context"]["id"] for t in feed if "Tweet_Info" in t and "context" in t["Tweet_Info"]]
    
    # 5. Like some tweets to create engagement
    print("\nLiking tweets...")
    for tid in tweet_ids[:2]:
        res = requests.post(f"{BASE_URL}/walker/like_tweet/{tid}", headers=headers)
        print(f"Like tweet {tid} status: {res.status_code}, body: {res.text[:100]}")

    # 6. Test get_engagement_metrics
    print("\nTesting get_engagement_metrics...")
    res = requests.post(f"{BASE_URL}/walker/get_engagement_metrics", headers=headers, json={})
    metrics = res.json()["reports"][0]
    print(f"Metrics: {json.dumps(metrics, indent=2)}")
    
    # Verify metrics
    if metrics.get("total_tweets", 0) < 5:
        print("Warning: total_tweets is less than 5. It might be due to feed loading only recent ones or search mismatch.")
    
    # 7. Test get_content_performance
    print("\nTesting get_content_performance...")
    res = requests.post(f"{BASE_URL}/walker/get_content_performance", headers=headers, json={})
    performance = res.json()["reports"][0]
    print(f"Performance: {json.dumps(performance, indent=2)}")
    
    success = True
    if not (metrics.get("optimal_time") and metrics["optimal_time"] != "No Data"):
        print("FAIL: optimal_time missing or 'No Data'")
        success = False
        
    for item in performance:
        if "virality_score" not in item:
            print(f"FAIL: virality_score missing for content: {item['content']}")
            success = False
        elif item["engagement"] > 0 and item["virality_score"] <= 0:
            # Note: with very small hours, score should be > 0
            print(f"FAIL: virality_score is 0 for engaged content: {item['content']}")
            success = False

    if success:
        print("\nAnalytics verification SUCCESSFUL!")
    else:
        print("\nAnalytics verification FAILED checks.")

if __name__ == "__main__":
    try:
        test_analytics()
    except Exception as e:
        print(f"\nVerification FAILED with error: {e}")
        import traceback
        traceback.print_exc()
