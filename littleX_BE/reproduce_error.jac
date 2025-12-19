include "littleX.jac";

walker reproduce {
    can check with `root entry {
        print("Starting reproduction...");
        # 1. Create a profile
        p = here ++> Profile(username="Tester");
        
        # 2. Create a tweet as the profile
        # Based on create_tweet implementation:
        # tweet_node = here +>:Post():+> Tweet(...);
        # root +>:Post:+> tweet_node[0];
        
        t = p +>:Post:+> Tweet(content="Test content", embedding=[0.1]);
        root +>:Post:+> t[0];
        
        print(f"Created tweet: {jid(t[0])}");
        
        # 3. Try to call get_info
        try {
            info = t[0].get_info();
            print(f"Success! Username: {info.username}");
        } except Exception as e {
            print(f"Caught expected error: {e}");
            # Print parents to see what's there
            parents = [t[0]<-:Post:<-];
            print(f"Parents: {parents}");
            for p_node in parents {
                print(f" - Parent type: {type(p_node)} ID: {jid(p_node)} Name: {getattr(p_node, 'username', 'N/A')}");
            }
        }
    }
}
