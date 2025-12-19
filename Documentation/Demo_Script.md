# LittleX Hackathon Demo Recording Script

**Goal**: Showcase Project 3 Compliance in < 3 minutes.
**Tone**: Professional, technical, and fast-paced.

---

## Scene 1: Introduction & Architecture (0:00 - 0:30)
**Visual**: Show `README.md` Architecture Diagram, then split-screen with VS Code showing `littleX.jac`.
**Action**: Scroll briefly through `littleX.jac` showing `node` definitions and `walker` logic.
**Voiceover**: 
"Welcome to LittleX, an AI-native social platform built on the Jaseci Stack. Our architecture leverages Jac's graph capabilities for relationship mapping and `byLLM` for multi-agent AI intelligence. Here in the backend, you can see our native Graph nodes—Profile, Tweet, and Community—and the walkers that power our intelligent logic."

## Scene 2: AI-Powered Content Creation (0:30 - 1:00)
**Visual**: LittleX Frontend -> "Home" Feed. Click "What's on your mind?".
**Action**: 
1.  Type "I want to post about..." and stop.
2.  **Feature 1**: Click the **Magic Sparkle** button (AI Drafts). Let it generate text.
3.  **Feature 2**: Delete it. Type "This is a bad tweet". Click **Refine** (Pen icon). Show it change to "Checking in on the timeline...".
4.  **Feature 3**: Clear all. Type `Check out my new proje`. Wait for **Autocomplete** popup. Press **Tab**.
**Voiceover**:
"Let's look at our AI Agents in action. First, our Generative Agent can draft content from scratch using `suggest_tweet_content`. Second, our Refinment Agent polishes raw input into professional posts. And finally, our new Autocomplete Agent uses `byLLM` to predict my next words in real-time as I type."

## Scene 3: Graph Intelligence & Feed (1:00 - 1:45)
**Visual**: Scroll down the Main Feed. Then click "Communities" Sidebar.
**Action**: 
1.  Scroll feed. 
2.  Hover over a "Recommended" badge (if exists) or just explain the mix.
3.  Navigate to **Emerging Communities**.
**Voiceover**:
"Our feed isn't just a database query. The `load_feed` walker performs a complex graph traversal, blending tweets from followed users with content matched by semantic similarity and topic affinity. Over here, the 'Emerging Communities' panel uses an algorithm to score groups based on recent engagement velocity, identifying viral micro-communities before they explode."

## Scene 4: Real-Time & Social (1:45 - 2:15)
**Visual**: Click into a "Discussion Room" or "Community".
**Action**:
1.  Enter a room.
2.  Post a message. Show it appear.
3.  Click "Summarize Thread" (if available) or explain the potential.
**Voiceover**:
"Beyond static posts, LittleX supports real-time connection. Our Discussion Rooms allow for deep-dive conversations, managed by graph-based permission nodes that ensure security and scalability."

## Scene 5: Analytics & Predictive AI (2:15 - 2:45)
**Visual**: Click **Analytics** Dashboard.
**Action**: 
1.  Point to **Optimal Posting Time** card.
2.  Scroll to "Top Performing Content".
3.  Highlight a tweet with the **🔥 Viral** badge.
**Voiceover**:
"Finally, our Analytics Engine. Here, the `optimal_posting_time` walker analyzes my engagement history to suggest the perfect 2-hour window. And simpler metrics are enhanced by our Viral Prediction algorithm, which flags content with high engagement velocity using the 'Viral' badge you see here."

## Scene 6: Conclusion (2:45 - 3:00)
**Visual**: Back to Home Feed. Brief wave or branding.
**Voiceover**:
"LittleX demonstrates that by combining Jac's graph native capabilities with distinct AI agents, we can build social platforms that are smarter, faster, and more personal. Thanks for watching."
