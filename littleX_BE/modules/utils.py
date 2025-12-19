
def get_object_id(obj):
    """
    Safely extract the proper JID string from a Jac object.
    Jac Cloud requires the full 'n:Type:Hex' format for API lookups.
    """
    try:
        # If it's a string, return as is (might already be formatted)
        if isinstance(obj, str):
            return obj

        # Construct JID manually: n:Type:Hex
        if hasattr(obj, '__jac__') and hasattr(obj.__jac__, 'id'):
            hex_id = str(obj.__jac__.id)
            type_name = type(obj).__name__
            return f"n:{type_name}:{hex_id}"
            
        return str(obj)
    except Exception:
        return str(obj)
