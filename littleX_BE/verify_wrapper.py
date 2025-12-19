try:
    from modules.byllm_wrapper import Generative
    print("Wrapper imported.")
    
    import os
    if "OPENAI_API_KEY" in os.environ:
        print("OPENAI_API_KEY is set.")
    else:
        print("OPENAI_API_KEY is NOT set.")
    
    llm = Generative(model="gpt-4o")
    print("Generative initialized.")
    
    response = llm.generate("Hello, are you working?")
    print(f"Response ({type(response)}): {response}")
    
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
