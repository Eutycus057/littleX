import os
import openai

api_key = os.environ.get("OPENAI_API_KEY")
if not api_key:
    print("No API Key")
    exit(1)

client = openai.OpenAI(api_key=api_key)

try:
    completion = client.chat.completions.create(
        model="gpt-4o",
        messages=[
            {"role": "user", "content": "Hello world"}
        ]
    )
    print(completion.choices[0].message.content)
except Exception as e:
    print(f"Error: {e}")
