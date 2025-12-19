
import from littleX { smart_reply }

test verify_ai_response {
    print("Testing Smart Reply...");
    # We spawn on root or here depending on context. smart_reply has `root entry`.
    # Use root spawn for tests
    root spawn smart_reply(context="Is this working?");
}
