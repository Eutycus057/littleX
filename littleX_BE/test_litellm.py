import os
from litellm import completion

try:
    key = os.environ.get("OPENAI_API_KEY")
    if not key:
        print("OPENAI_API_KEY missing")
        exit(1)
        
    print(f"Testing litellm with key length: {len(key)}")
    response = completion(
        model="gpt-4o", 
        messages=[{"role": "user", "content": "Hello"}]
    )
    print("Litellm Response:", response.choices[0].message.content)
except Exception as e:
    print(f"Litellm Error: {e}")
