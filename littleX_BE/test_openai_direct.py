import os
import sys
from openai import OpenAI

try:
    key = os.environ.get("OPENAI_API_KEY")
    if not key:
        print("Error: OPENAI_API_KEY missing")
        sys.exit(1)
        
    client = OpenAI(api_key=key)
    completion = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {"role": "user", "content": "Say 'Direct OpenAI Works'"}
        ]
    )
    print("Response:", completion.choices[0].message.content)
except Exception as e:
    print(f"Error: {e}")
