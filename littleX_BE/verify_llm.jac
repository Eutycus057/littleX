
import from littleX { refine_tweet, summarize_conversation }

walker verify_ai_test {
    can run with `root entry {
        print("\n=== [TEST] AI Feature Verification ===");
        
        # 1. Test Refine Tweet
        print("\n--- Testing 'refine_tweet' ---");
        print("Input: 'yo check this out its cool'");
        here spawn refine_tweet(content="yo check this out its cool");
        
        # 2. Test Summarize
        print("\n--- Testing 'summarize_conversation' ---");
        comments = [
            "This feature is amazing!",
            "I agree, but it needs better UI.",
            "UI is fine, just fix the bugs.",
            "Agreed on bugs."
        ];
        print(f"Input: {comments}");
        here spawn summarize_conversation(comments=comments);
        
        print("\n=== [TEST] Requests Sent (Check Reports) ===\n");
    }
}
