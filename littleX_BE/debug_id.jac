
import from littleX { Tweet }
import from modules.utils { get_object_id }

walker verify_id_format {
    can check_id with `root entry {
        # Create a dummy tweet
        t = spawn here ++> Tweet(content="Test");
        print(f"Standard str(t): {str(t)}");
        print(f"get_object_id(t): {get_object_id(t)}");
        
        # Check if we can access type info
        print(f"Type name: {type(t).__name__}");
        
        # Check jid property
        if hasattr(t, 'jid') {
             print(f"t.jid(): {t.jid()}");
        } else {
             print("t has no jid attribute/method");
        }
    }
}
