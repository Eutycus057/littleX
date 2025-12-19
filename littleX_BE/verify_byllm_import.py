try:
    print("Attempting to import Generative from byllm.Generative...")
    from byllm.Generative import Generative
    print("Successfully imported Generative.")
    
    print("Attempting to initialize Generative...")
    llm = Generative(model="gpt-4o")
    print(f"Generative initialized: {llm}")
    print(f"Type of llm: {type(llm)}")
    print(f"Dir of llm: {dir(llm)}")
    if hasattr(llm, 'generate'):
        print(f"llm.generate: {llm.generate}")
    else:
        print("llm has no generate method")
except Exception as e:
    print(f"Error: {e}")
    # import traceback
    # traceback.print_exc()

import byllm
import os
print(f"byllm file: {byllm.__file__}")
print(f"byllm dir: {os.path.dirname(byllm.__file__)}")
for root, dirs, files in os.walk(os.path.dirname(byllm.__file__)):
    print(f"Directory: {root}")
    print(f"Files: {files}")


