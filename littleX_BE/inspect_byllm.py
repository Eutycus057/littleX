import byllm
import inspect

print("--- byllm attributes ---")
print(dir(byllm))

if hasattr(byllm, 'Generative'):
    print("\n--- byllm.Generative attributes ---")
    print(dir(byllm.Generative))
    print(f"Type: {type(byllm.Generative)}")
else:
    print("\nbyllm has no Generative attribute")
