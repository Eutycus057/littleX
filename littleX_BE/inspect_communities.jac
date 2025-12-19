
import from littleX { Community }

walker inspect_communities {
    can inspect with `root entry {
        print("\n=== SYSTEM COMMUNITIES ===");
        for c in [root-->(`?Community)] {
            print(f"Name: {c.name}, ID: {jid(c)}");
            print(f"  Description: {c.description}");
            print(f"  Activity Score: {c.activity_score}");
            print(f"  Members: {len([c<-:MemberOf:<-])}");
            print("---");
        }
        print("==========================\n");
    }
}
