import os
print("Starting debug script...")
try:
    print("Importing byllm...")
    from byllm.llm import Model
    print("Import successful.")
except Exception as e:
    print(f"Import failed: {e}")

print(f"API KEY PRESENT: {'OPENAI_API_KEY' in os.environ}")
print("Importing Model...")
try:
    llm = Model(model_name="gpt-4o")
    print("Model initialized successfully.")
except Exception as e:
    print(f"Error initializing model: {e}")
