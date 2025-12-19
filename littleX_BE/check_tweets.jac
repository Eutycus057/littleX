include "littleX.jac";

walker check_tweets {
    can check with `root entry;
}

impl check_tweets.check {
    # 1. Check tweets connected to root
    root_tweets = [here-->(`?Tweet)];
    print(f"Total tweets connected to root: {len(root_tweets)}");
    
    # 2. Check all Profile nodes and their tweets
    profiles = [here-->(`?Profile)];
    print(f"Total profiles: {len(profiles)}");
    
    for p in profiles {
        p_tweets = [p-->(`?Tweet)];
        print(f"Profile {p.username} has {len(p_tweets)} tweets.");
        for t in p_tweets {
            print(f"  Tweet ID: {jid(t)}, Content: {t.content[:30]}...");
        }
    }
    
    # 3. Check all Tweet nodes in existence (via NodeAnchor)
    all_tweets = [];
    for t_anchor in NodeAnchor.Collection.find({"name": "Tweet"}) {
        if t_anchor.archetype {
            all_tweets.append(t_anchor.archetype);
        }
    }
    print(f"Total Tweet nodes in system (NodeAnchor): {len(all_tweets)}");
    for t in all_tweets {
        # Check parent profiles
        parents = [t<-:Post:<-];
        parent_names = [p.username for p in parents];
        print(f"  Tweet ID: {jid(t)}, Content: {t.content[:30]}..., Parents: {parent_names}");
        
        # Check if connected to root
        root_conn = [t<-:Post:<-root];
        if root_conn {
             print(f"    - Connected to root");
        } else {
             print(f"    - NOT connected to root");
        }
    }
}
