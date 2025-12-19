import datetime;
import numpy;
import from sklearn.feature_extraction.text { TfidfVectorizer }
import from jac_cloud.core.archetype { NodeAnchor }
import from sklearn.metrics.pairwise { cosine_similarity }

glob vectorizer = TfidfVectorizer();

def search_tweets(query: str, tweet:str) -> int;

node Profile {
    has username: str = "";

    can update with update_profile entry;

    can get with get_profile entry;

    can follow with follow_request entry;

    can un_follow with un_follow_request entry;
}

obj TweetInfo {
    has username: str;
    has id: str;
    has content: str;
    has created_at: str;
    has embedding: list;
    has likes: list;
    has comments: list;
    has images: list = [];
    has videos: list = [];
    has docs: list = [];
}

node Tweet {
    has content: str;
    has embedding: list;
    has created_at: str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S");
    has images: list = [];
    has videos: list = [];
    has docs: list = [];

    can update with update_tweet exit;

    can delete with remove_tweet exit;

    can like_tweet with like_tweet entry;

    can remove_like with remove_like entry;

    can comment with comment_tweet entry;

    def get_info()-> TweetInfo;

    can get with load_feed entry;
}

node Comment {
    has content: str;

    can update with update_comment entry;

    can delete with remove_comment entry;
}

node Room {
    has name: str;
    has created_at: str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S");
}

node Message {
    has content: str;
    has sender: str;
    has created_at: str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S");
}

node Topic {
    has name: str;
    has score: float = 0.0;
}

node Community {
    has name: str;
    has description: str = "";
    has created_at: str = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S");
    has activity_score: float = 0.0;
    has last_active: str = datetime.datetime.now().isoformat();
}

edge Follow {}

edge Like {}

edge Post {}

edge RelatesTo {}
edge MemberOf {}
edge Context {}
edge Contains {}
edge HasMessage {}

walker visit_profile {
    can visit_profile with `root entry;
}

walker update_profile(visit_profile) {
    has new_username: str;
}

walker get_profile(visit_profile) {}

walker load_user_profiles {

    can load_profiles with `root entry;

    can report_profiles with exit;
}

walker get_user_count {
    can count with `root entry;
}

walker follow_request {}

walker un_follow_request {}

walker create_tweet(visit_profile) {
    has content: str;
    has community_id: str = "";
    has images: list = [];
    has videos: list = [];
    has docs: list = [];

    can tweet with Profile entry;
}

walker update_tweet {
    has updated_content: str;
}

walker remove_tweet {}

walker like_tweet {
    can like with Tweet entry {
        profiles = [root-->(`?Profile)];
        if profiles {
            here +>:Like():+> profiles[0];
            report here;
        }
    }
}

walker remove_like {
    can unlike with Tweet entry {
        current_profile = [root-->(`?Profile)];
        if current_profile {
            like_edge = [edge here ->:Like:-> current_profile[0]];
            if like_edge {
                del like_edge[0];
            }
            report here;
        }
    }
}

walker comment_tweet {
    has content: str;
    can comment with Tweet entry {
        current_profile = [root-->(`?Profile)];
        if current_profile {
            comment_node = current_profile[0] +>:Post():+> Comment(content=self.content);
            grant(comment_node[0], level=ConnectPerm);
            here ++> comment_node[0];
            report comment_node[0];
        }
    }
}

walker update_comment {
    has updated_content: str;
}

walker remove_comment {}

walker create_community {
    has name: str;
    has description: str = "";
    can create with `root entry;
}

walker join_community {
    has community_id: str;
    can join with `root entry;
}

walker leave_community {
    has community_id: str;
    can leave with `root entry;
}

walker get_my_communities {
    can fetch with `root entry;
}

walker get_community_feed {
    has community_id: str;
    can fetch with `root entry;
}

walker get_emerging_communities {
    can fetch with `root entry;
}

walker generate_hashtags {
    has content: str;
    can generate with `root entry;
}

walker get_trending_topics {
    can collect with `root entry;
}

walker get_engagement_metrics {
    has metrics: dict = {};
    can calculate with `root entry;
}

walker get_content_performance {
    has performance: list = [];
    can analyze with `root entry;
}

walker create_room {
    has community_id: str;
    has name: str;
    can create with `root entry;
}

walker get_community_rooms {
    has community_id: str;
    can fetch with `root entry;
}

walker send_message {
    has community_id: str;
    has room_id: str;
    has content: str;
    can send with `root entry;

    class __specs__ {
        has methods: list = ["websocket", "post"];
    }
}

walker get_room_messages {
    has community_id: str;
    has room_id: str;
    can fetch with `root entry;
}


import from byllm.llm { Model }
import from modules.utils { get_object_id }
import from jac_cloud.plugin {WEBSOCKET_MANAGER as socket}

glob llm = Model(model_name="gpt-4o");

def generate_smart_reply(context: str) -> str by llm();
def generate_summary(text: str) -> str by llm();
def refine_tweet_content(content: str) -> str by llm();
def generate_hashtags_list(content: str) -> str by llm();
def generate_tweet_suggestion(context: str) -> str by llm();

walker smart_reply {
    has context: str;
    can generate with `root entry;
}

impl smart_reply.generate {
    report generate_smart_reply(self.context);
}

walker summarize_conversation {
    has comments: list[str];
    can generate with `root entry;
}

walker refine_tweet {
    has content: str;
    can generate with `root entry;
}

walker suggest_tweet_content {
    has suggestion: str = "";
    can generate with `root entry;
}


impl summarize_conversation.generate {
    report generate_summary(str(self.comments));
}

impl refine_tweet.generate {
    report refine_tweet_content(self.content);
}

impl suggest_tweet_content.generate {
    # 1. Get Top Content
    top_content = [];
    profiles = [here-->(`?Profile)];
    if not profiles and isinstance(here, Profile) { profiles = [here]; }
    
    for p in profiles {
        for t in [p-->(`?Tweet)] {
             engagement = len([t->:Like:->]) + len([t-->(`?Comment)]);
             top_content.append({"content": t.content, "score": engagement});
        }
    }
    top_content.sort(key=lambda x:dict:x['score'], reverse=True);
    top_text = [item["content"] for item in top_content[:3]];
    
    # 2. Get Trending Topics
    trending = [];
    for t_anchor in NodeAnchor.Collection.find({"name": "Topic"}) {
        if t_anchor.archetype {
             trending.append(t_anchor.archetype.name);
        }
    }
    trending_text = trending[:5];
    
    context = f"Top Content: {top_text}. Trending: {trending_text}.";
    self.suggestion = generate_tweet_suggestion(context);
    report self.suggestion;
}


walker load_feed(visit_profile) {
    has search_query: str = "";
    has results: list = [];

    can load with Profile entry;

    can report_feed with exit;

}


impl search_tweets {
    if not query {
        return [0.0];
    }
    try {
        transformed = vectorizer.fit_transform([query, tweet]);
        similarity = cosine_similarity(transformed[0], transformed[1])[0];
        return similarity.tolist();
    } except Exception as e {
        print(f"Error during search: {e}");
        return [0.0];
    }
}

impl Profile.update {
    self.username = visitor.new_username;
    report self;
}

impl Profile.get {
        follwers=[{"id": get_object_id(i), "username": i.username} for i in [self-->(`?Profile)]];
        report {"user": self, "followers": follwers};
    }

impl Profile.follow{
        current_profile = [root-->(`?Profile)];
        current_profile[0] +>:Follow():+> self;
        report self;
    }

    impl Profile.un_follow {
        current_profile = [root-->(`?Profile)];
        follow_edge = [edge current_profile[0] ->:Follow:-> self];
        del follow_edge[0];
        report self;
    }

impl Tweet.update {
        self.content = visitor.updated_content;
        report self;
    }

impl Tweet.delete {
        del self;
        disengage;
    }

impl Tweet.get_info {
        return TweetInfo(
            username=[self<-:Post:<-][0].username,
            id=get_object_id(self),
            content=self.content,
            embedding=self.embedding,
            likes=[i.username for i in [self->:Like:->]],
            comments=[{"username": [i<--(`?Profile)][0].username, "id": get_object_id(i), "content": i.content} for i in [self-->(`?Comment)]],
            images=self.images,
            videos=self.videos,
            docs=self.docs,
            created_at=self.created_at
        );
    }

impl Tweet.get {
        tweet_info = self.get_info();
        similarity = search_tweets(visitor.search_query, tweet_info.content);
        visitor.results.append({"Tweet_Info": tweet_info, "similarity": similarity});
    }

impl Comment.update {
        self.content = visitor.updated_content;
        report self;
    }

impl Comment.delete {
        del self;
        disengage;
    }

    impl visit_profile.visit_profile {
        profiles = [-->(`?Profile)];
        if profiles {
            if profiles[0].username == "" {
                profiles[0].username = "User";
            }
            visit profiles[0];
        } else {
            new_profile = here ++> Profile(username="User");
            grant(new_profile[0], level=ConnectPerm);
            visit new_profile;
        }
    }

    impl load_user_profiles.load_profiles {
        self.profiles: list = [];
        
        count = 0;
        for user in NodeAnchor.Collection.find({"name": "Profile"}) {
             if user.archetype {
                user_node = user.archetype;
                 self.profiles.append(
                    {"username": user_node.username, "id": get_object_id(user_node)}
                 );
                 count += 1;
                 if count >= 20 {
                     break;
                 }
             }
        }
    }

impl load_user_profiles.report_profiles {
    report self.profiles;
}

    impl create_tweet.tweet {
        embedding = vectorizer.fit_transform([self.content]).toarray().tolist();
        tweet_node = here +>:Post():+> Tweet(content=self.content, embedding=embedding, images=self.images, videos=self.videos, docs=self.docs, created_at=datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S"));
        grant(tweet_node[0], level=ConnectPerm);


        words = self.content.split();
        for w in words {
            if (w.startswith("#") and len(w) > 1) {
                topic_name = w[1:].lower();
                target_topic = None;
                for t in [root--> (`?Topic)] {
                    if t.name == topic_name {
                        target_topic = t;
                        break;
                    }
                }
                
                if (target_topic) {
                    target_topic.score += 1.0;
                } else {
                    target_topic_node = root ++> Topic(name=topic_name, score=1.0);
                    target_topic = target_topic_node[0];
                    grant(target_topic, level=ConnectPerm);
                }
                
                tweet_node[0] +>:RelatesTo:+> target_topic;
            }
        }

        if self.community_id {
            target_community = None;
            for c in [root-->(`?Community)] {
                 if get_object_id(c) == self.community_id {
                     target_community = c;
                     break;
                 }
            }
            if target_community {
                tweet_node[0] +>:Context:+> target_community;
                # Boost trending score for new content
                target_community.activity_score += 2.0;
                target_community.last_active = datetime.datetime.now().isoformat();
            }
        }

        report tweet_node;
    }

impl load_feed.load {
        visit [-->(`?Tweet)];
        for user_node in [->:Follow:->(`?Profile)] {
            recent_tweets = [user_node-->(`?Tweet)][-10:];
            visit recent_tweets;
        }
        
        for topic in [root-->(`?Topic)] {
            if topic.score > 2.0 {
                 topic_tweets = [topic<--(`?Tweet)][-5:];
                 visit topic_tweets;
            }
        }
    }

impl load_feed.report_feed {
        self.results.sort(key=lambda x:dict:x['similarity'][0], reverse=True);
        report self.results;
}
impl generate_hashtags.generate {
    report generate_hashtags_list(self.content);
}

impl get_trending_topics.collect {
    all_topics = {};
    # Find all Topic nodes in the system (global search)
    # This ensures users see trends from everyone, not just their own graph
    for t_anchor in NodeAnchor.Collection.find({"name": "Topic"}) {
        if t_anchor.archetype {
            topic = t_anchor.archetype;
            if topic.name in all_topics {
                all_topics[topic.name] += topic.score;
            } else {
                all_topics[topic.name] = topic.score;
            }
        }
    }
    
    # Sort by score descending (optional but good for UI)
    sorted_topics = [{"name": item[0], "score": item[1]} for item in all_topics.items()];
    sorted_topics.sort(key=lambda x:dict:x['score'], reverse=True);
    
    report sorted_topics;
}

impl get_engagement_metrics.calculate {
    # Start looking from the current node (expected to be user root)
    # Search for connected profiles
    profiles = [here-->(`?Profile)];

    if not profiles {
        # Fallback: Maybe we ARE on a profile?
        if isinstance(here, Profile) {
             profiles = [here];

        } else {
             report {
                "total_tweets": 0,
                "total_likes": 0, 
                "total_comments": 0,
                "followers": 0,
                "following": 0
            };
            disengage;
        }
    }

    total_tweets = 0;
    total_likes = 0;
    total_comments = 0;
    followers = 0;
    following = 0;

    for user_profile in profiles {
        # My Tweets
        my_tweets = [user_profile-->(`?Tweet)];
        t_count = len(my_tweets);

        total_tweets += t_count;
        
        for t in my_tweets {
            # Use ->:Like:-> instead of generic follow-out
            likes = [t->:Like:->];
            comments = [t-->(`?Comment)];
            
            total_likes += len(likes);
            total_comments += len(comments);
        }
        
        # Following (outgoing)
        following += len([user_profile-->(`?Profile)]);
        
        # Followers (incoming) make sure it counts correctly
        followers += len([user_profile<-:Follow:<-]);
    }

    self.metrics = {
        "total_tweets": total_tweets,
        "total_likes": total_likes,
        "total_comments": total_comments,
        "followers": followers,
        "following": following,
        "optimal_time": "No Data"
    };

    # Calculate optimal posting time
    # Analyze hours of tweets with > 0 engagement
    hour_counts = {};
    for user_profile in profiles {
        for t in [user_profile-->(`?Tweet)][-50:] {
             # Check engagement
             likes = len([t->:Like:->]);
             comments = len([t-->(`?Comment)]);
             if likes > 0 or comments > 0 {
                 try {
                     dt = datetime.datetime.strptime(t.created_at, "%Y-%m-%d %H:%M:%S");
                     h = dt.hour;
                     if h in hour_counts {
                         hour_counts[h] += (likes + comments);
                     } else {
                         hour_counts[h] = (likes + comments);
                     }
                 } except Exception {
                     continue;
                 }
             }
        }
    }
    
    if hour_counts {
        max_val = -1;
        best_hour = 0;
        for h in hour_counts.keys() {
            if hour_counts[h] > max_val {
                max_val = hour_counts[h];
                best_hour = h;
            }
        }
        # Format as 2:00 - 3:00
        next_hour = (best_hour + 1) % 24;
        self.metrics["optimal_time"] = str(best_hour) + ":00 - " + str(next_hour) + ":00";
    }

    report self.metrics;
}

impl get_content_performance.analyze {
    profiles = [here-->(`?Profile)];
    if not profiles {
        if isinstance(here, Profile) {
             profiles = [here];
        } else {
             report [];
             disengage;
        }
    }
    
    scored_tweets = [];
    
    for user_profile in profiles {
        # Limit to recent 100 tweets for performance
        my_tweets = [user_profile-->(`?Tweet)][-100:];
        
        for t in my_tweets {
            likes = len([t->:Like:->]);
            comments = len([t-->(`?Comment)]);
            engagement = likes + comments;
            
            # Direct access avoiding get_info overhead
            scored_tweets.append({
                "content": t.content,
                "engagement": engagement,
                "likes": likes,
                "comments": comments,
                "created_at": t.created_at,
                "virality_score": 0.0
            });

            # Calculate Virality Score
            # Formula: (Engagement * 10) / (Hours + 2)^1.5
            try {
                now = datetime.datetime.now();
                created = datetime.datetime.strptime(t.created_at, "%Y-%m-%d %H:%M:%S");
                diff = now - created;
                hours = diff.total_seconds() / 3600.0;
                
                score = (engagement * 10.0) / ((hours + 2.0) ** 1.5);
                scored_tweets[-1]["virality_score"] = round(score, 2);
            } except Exception as e {
                print(f"Error calculating virality: {e}");
                continue;
            }
        }
    }
    
    # Sort by engagement descending
    scored_tweets.sort(key=lambda x:dict:x['engagement'], reverse=True);
    
    self.performance = scored_tweets[:5];
    report self.performance;
}


impl create_community.create {
    # Create community attached to root
    new_community = root ++> Community(name=self.name, description=self.description);
    
    # Auto-join creator (assuming walker run from user context/root)
    # Find user profile
    user_profile = None;
    if isinstance(here, Profile) {
        user_profile = here;
    } else {
        profiles = [here-->(`?Profile)];
        if profiles {
            user_profile = profiles[0];
        }
    }
    
    grant(new_community[0], level=ConnectPerm);
    
    if user_profile {
        user_profile +>:MemberOf:+> new_community;
        # Boost initial score
        new_community[0].activity_score = 10.0;
        new_community[0].last_active = datetime.datetime.now().isoformat();
    }
    
    report new_community;
}

impl join_community.join {
    # Find community by ID (scan root connections)
    target = None;
    all_communities = [root-->(`?Community)];
    for c_anchor in NodeAnchor.Collection.find({"name": "Community"}) {
        if c_anchor.archetype {
             c = c_anchor.archetype;
             if get_object_id(c) == self.community_id {
                 target = c;
                 break;
             }
        }
    }
    
    if target {
        # Find user profile
        user_profile = None;
        if isinstance(here, Profile) {
            user_profile = here;
        } else {
            profiles = [here-->(`?Profile)];
            if profiles {
                user_profile = profiles[0];
            }
        }
        
        if user_profile {
             # Check if already member
             is_member = False;
             for existing in [user_profile->:MemberOf:->] {
                 if existing == target {
                     is_member = True;
                     break;
                 }
             }
             
             if not is_member {
                 user_profile +>:MemberOf:+> target;
                 # Boost trending score for new member
                 target.activity_score += 5.0;
                 target.last_active = datetime.datetime.now().isoformat();
             }
        }
    }
}

impl leave_community.leave {
     # Find community by ID (scan root connections)
    target = None;
    all_communities = [root-->(`?Community)];
    for c_anchor in NodeAnchor.Collection.find({"name": "Community"}) {
        if c_anchor.archetype {
             c = c_anchor.archetype;
             if get_object_id(c) == self.community_id {
                 target = c;
                 break;
             }
        }
    }
    
    if target {
        # Find user profile
        user_profile = None;
        if isinstance(here, Profile) {
            user_profile = here;
        } else {
            profiles = [here-->(`?Profile)];
            if profiles {
                user_profile = profiles[0];
            }
        }
        
        if user_profile {
             # Remove edge
             for edge_node in [edge user_profile ->:MemberOf:-> target] {
                 del edge_node;
             }
        }
    }
}

impl get_my_communities.fetch {
    # Find user profile
    user_profile = None;
    if isinstance(here, Profile) {
        user_profile = here;
    } else {
        profiles = [here-->(`?Profile)];
        if profiles {
            user_profile = profiles[0];
        }
    }
    
    communities = [];
    if user_profile {
        communities = [user_profile->:MemberOf:->];
    }
    
    # Also fetch "Available" communities (all attached to root) for discovery?
    # Requirement: "Interest Groups". Let's return joined + all for now to help UI
    all_communities = [root-->(`?Community)];
    
    reports = [];
    # My communities (joined)
    for c in communities {
        reports.append({
            "id": get_object_id(c),
            "name": c.name,
            "description": c.description,
            "joined": True
        });
    }
    
    # Other communities (not joined)
    for c in all_communities {
        is_joined = False;
        for my_c in communities {
            if jid(c) == jid(my_c) {
                is_joined = True;
                break;
            }
        }
        
        if not is_joined {
            reports.append({
                "id": get_object_id(c),
                "name": c.name,
                "description": c.description,
                "joined": False
            });
        }
    }
    
    report reports;
}

impl get_community_feed.fetch {
    # Find community
    target = None;
    all_communities = [root-->(`?Community)];
    for c_anchor in NodeAnchor.Collection.find({"name": "Community"}) {
        if c_anchor.archetype {
             c = c_anchor.archetype;
             if get_object_id(c) == self.community_id {
                 target = c;
                 break;
             }
        }
    }
    
    tweets = [];
    if target {
        # Fetch tweets linked to community via Context edge
        # Incoming edge to Community from Tweet: Tweet +>:Context:+> Community
        tweets = [target<--(`?Tweet)]; 
    }
    
    results = [];
    for t in tweets {
        results.append(t.get_info());
    }
    report results;
}

impl get_emerging_communities.fetch {
    all_communities = [root-->(`?Community)];
    scored = [];
    
    # Calculate effective score with time decay
    # Formula: Score / (Hours + 2)^1.5
    now = datetime.datetime.now();
    
    for c in all_communities {
        try {
            last = datetime.datetime.fromisoformat(c.last_active);
            diff = now - last;
            hours = diff.total_seconds() / 3600.0;
        } except Exception {
            hours = 0.0;
        }
        
        # Avoid division by zero and apply gravity
        gravity = (hours + 2.0) ** 1.5;
        effective_score = c.activity_score / gravity;
        
        scored.append({"community": c, "score": effective_score});
    }
    
    # Sort by effective score
    scored.sort(key=lambda x:dict:x['score'], reverse=True);
    
    # Return top 5
    top_5 = scored[:5];
    
    reports = [];
    for item in top_5 {
        c = item["community"];
        reports.append({
            "id": get_object_id(c),
            "name": c.name,
            "description": c.description,
            "score": item["score"],
            "members": len([c<-:MemberOf:<-])
        });
    }
    
    report reports;
}

impl create_room.create {
    target_community = None;
    for c_anchor in NodeAnchor.Collection.find({"name": "Community"}) {
        if c_anchor.archetype {
             c = c_anchor.archetype;
             if get_object_id(c) == self.community_id {
                 target_community = c;
                 break;
             }
        }
    }
    
    if target_community {
        new_room = target_community ++> Room(name=self.name);
        grant(new_room[0], level=ConnectPerm);
        target_community +>:Contains:+> new_room[0];
        report new_room[0];
    } else {
        report None;
    }
}

impl get_community_rooms.fetch {
    target_community = None;
    for c_anchor in NodeAnchor.Collection.find({"name": "Community"}) {
        if c_anchor.archetype {
             c = c_anchor.archetype;
             if get_object_id(c) == self.community_id {
                 target_community = c;
                 break;
             }
        }
    }
    
    rooms = [];
    if target_community {
        rooms = [target_community->:Contains:->];
    }
    
    report [{"id": get_object_id(r), "name": r.name, "created_at": r.created_at} for r in rooms];
}

impl send_message.send {
    # Find user
    username = "User";
    if isinstance(here, Profile) {
        username = here.username;
    } else {
        profiles = [here-->(`?Profile)];
        if profiles {
            username = profiles[0].username;
        }
    }

    target_room = None;
    for c_anchor in NodeAnchor.Collection.find({"name": "Community"}) {
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
    }
    
    if target_room {
        msg = target_room ++> Message(content=self.content, sender=username);
        grant(msg[0], level=ConnectPerm);
        target_room +>:HasMessage:+> msg[0];

        # Broadcast to room channel
        socket.notify_channels([self.room_id], {
            "type": "chat", 
            "data": {
                "id": get_object_id(msg[0]),
                "content": self.content,
                "sender": username,
                "created_at": msg[0].created_at
            }
        });

        report msg[0];
    } else {
        report None;
    }
}

impl get_room_messages.fetch {
    target_room = None;
    for c_anchor in NodeAnchor.Collection.find({"name": "Community"}) {
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
    }
    
    messages = [];
    if target_room {
        # Fetch all messages limit to last 50
        all_msgs = [target_room->:HasMessage:->];
        messages = all_msgs[-50:]; 
    }
    
    report [{"id": get_object_id(m), "content": m.content, "sender": m.sender, "created_at": m.created_at} for m in messages];
}


impl get_user_count.count {
    count = 0;
    for user in NodeAnchor.Collection.find({"name": "Profile"}) {
        if user.archetype {
            count += 1;
        }
    }
    report {"count": count};
}
