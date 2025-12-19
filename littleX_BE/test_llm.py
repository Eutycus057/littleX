import os
import sys

try:
    # Try importing class from module with same name
    from byllm.Generative import Generative
    print("Successfully imported Generative class from byllm.Generative module")
except ImportError:
    try:
        from byllm import Generative
        print("Imported Generative (likely module) from byllm")
    except ImportError as e:
        print(f"Failed to import byllm: {e}")
        sys.exit(1)

key = os.environ.get("OPENAI_API_KEY")
if not key:
    print("Error: OPENAI_API_KEY not found in environment")
else:
    print(f"OPENAI_API_KEY found (length: {len(key)})")

try:
    llm = Generative(model="gpt-4o")
    print("Generative model initialized")
    response = llm.generate("Hello, say 'Test Successful' if you can hear me.")
    print(f"LLM Response: {response}")
except Exception as e:
    print(f"Error during generation: {e}")
