
import os

file_path = "/home/eutycus/littleX/littleX_BE/littleX.jac"

with open(file_path, "r") as f:
    content = f.read()

# Replacement 1: Community Lookup using NodeAnchor
# variations of the loop
old_pattern_1 = """    for c in all_communities {
        if get_object_id(c) == self.community_id {
            target = c;
            break;
        }
    }"""

new_pattern = """    for c_anchor in NodeAnchor.Collection.find({"name": "Community"}) {
        if c_anchor.archetype {
             c = c_anchor.archetype;
             if get_object_id(c) == self.community_id {
                 target = c;
                 break;
             }
        }
    }"""
    
content = content.replace(old_pattern_1, new_pattern)

old_pattern_2 = """    for c in [root-->(`?Community)] {
        if jid(c) == self.community_id {
            target_community = c;
            break;
        }
    }"""

new_pattern_2 = """    for c_anchor in NodeAnchor.Collection.find({"name": "Community"}) {
        if c_anchor.archetype {
             c = c_anchor.archetype;
             if get_object_id(c) == self.community_id {
                 target_community = c;
                 break;
             }
        }
    }"""
    
content = content.replace(old_pattern_2, new_pattern_2)

# Special case for nested loops (send_message, get_room_messages)
# send_message: lines 948-958
old_pattern_3 = """    for c in [root-->(`?Community)] {
        if get_object_id(c) == self.community_id {
            for r in [c->:Contains:->] {
                if get_object_id(r) == self.room_id {
                    target_room = r;
                    break;
                }
            }
            break;
        }
    }"""

new_pattern_3 = """    for c_anchor in NodeAnchor.Collection.find({"name": "Community"}) {
        if c_anchor.archetype {
             c = c_anchor.archetype;
             if get_object_id(c) == self.community_id {
                 for r in [c->:Contains:->] {
                    if get_object_id(r) == self.room_id {
                        target_room = r;
                        break;
                    }
                }
                 break;
             }
        }
    }"""

content = content.replace(old_pattern_3, new_pattern_3)

with open(file_path, "w") as f:
    f.write(content)

print("Successfully patched littleX.jac")
