try:
    import byllm.Generative as BG
    print("--- byllm.Generative module attributes ---")
    print(dir(BG))
    print(f"Type: {type(BG)}")
except ImportError as e:
    print(f"Could not import byllm.Generative: {e}")

print("\n--- jac_cloud inspection ---")
try:
    import jac_cloud
    print(dir(jac_cloud))
    if hasattr(jac_cloud, 'llm'):
        print(dir(jac_cloud.llm))
except ImportError as e:
    print(f"Could not import jac_cloud: {e}")
