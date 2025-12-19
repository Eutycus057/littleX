include "littleX.jac";

walker inspect_root {
    can inspect with `root entry;
}

impl inspect_root.inspect {
    profiles = [here-->(`?Profile)];
    print(f"Root connected to {len(profiles)} profiles.");
    for p in profiles {
        print(f"Profile: {p.username}, ID: {jid(p)}");
        followers = [p-->(`?Profile)];
        print(f"  - Follows/Connected to: {len(followers)} profiles");
    }
}
