import byllm.llm
import inspect

print("Inspecting byllm.llm...")
print(f"Dir: {dir(byllm.llm)}")

if hasattr(byllm.llm, 'Model'):
    print("Found Model class.")
    from byllm.llm import Model
    try:
        model = Model(model_name="gpt-4o")
        print(f"Model initialized: {model}")
        print(f"Dir of model: {dir(model)}")
        if hasattr(model, 'generate'):
            print("Model has generate method.")
            # Try to generate
            # response = model.generate("Hello") # Might cost money or fail if key invalid
            # print(f"Generate response: {response}") 
    except Exception as e:
        print(f"Error initializing Model: {e}")
else:
    print("Model class not found in byllm.llm")
