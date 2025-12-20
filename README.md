# LittleX: AI-Native Social Media Platform

LittleX is a next-generation social media application built on the **Jaseci (Jac) Stack**. It demonstrates the power of **Graph-based architectures** combined with **Generative AI Agents** to create a deeper, smarter social experience.

> **Project 3 Compliant**: This project implements advanced social features including Community Building, Predictive Analytics, and AI Assistants.

---

## 🌟 Key Features

### 🧠 AI-Powered Agents
-   **AI Autocomplete**: Intelligent sentence completion in the Tweet editor using `byLLM`.
-   **Viral Prediction**: Real-time analysis of engagement velocity to predict and badge "**🔥 Viral**" content.
-   **Optimal Posting Time**: Analytics engine suggesting the best 2-hour window for maximum engagement.
-   **Generative Content**:
    -   **Magic Drafts**: Generate tweet ideas based on trending topics.
    -   **Refine Polish**: Rewrite tweets for better tone and impact.
    -   **Smart Replies**: Context-aware reply suggestions for comments.
    -   **Summarization**: Auto-summarize long discussion threads.

### 🕸️ Graph Intelligence
-   **Emerging Communities**: Algorithms identify and promote fast-growing micro-communities.
-   **Hybrid Feed**: Curation mixing social connections (Following) with Topic Affinity and semantic search.
-   **Deep Threading**: "Discussion Rooms" for focused, real-time community conversations.

### 📊 Interactive Analytics
-   **Engagement Dashboard**: Track followers, likes, and comments.
-   **Growth Insights**: Visualize top-performing content and viral scores.

---

## 🏗️ Architecture

LittleX uses a **multi-agent design** where specialized walkers act as autonomous agents interacting with the global graph.

-   **Backend**: `littleX.jac` (Jaseci Language)
    -   **Nodes**: `Profile`, `Tweet`, `Community`, `Room`, `Topic`.
    -   **Edges**: `Follow`, `MemberOf`, `RelatesTo` (Weighted Context).
    -   **Walkers**: `load_feed`, `suggest_tweet_content`, `autocomplete_text`, `verify_fixes`.
-   **AI Integration**: `byLLM` library for seamless LLM calls (GPT-4o).
-   **Frontend**: Next.js (React) + Redux Toolkit + TailwindCSS.

![Architecture](Documentation/images/Architecture.png)

## 🎥 Demo Video

[![LittleX Demo Video](https://img.youtube.com/vi/MkZUrsQry28/0.jpg)](https://www.youtube.com/watch?v=MkZUrsQry28 "LittleX Demo Video – Click to Watch")

---

## 🚀 Getting Started

### Prerequisites
-   Python 3.10+
-   Node.js 18+
-   `jaclang` and `jac-cloud` (optional for cloud deploy)

### 1. Clone & Setup
```bash
git clone https://github.com/Eutycus057/littleX.git
cd littleX
```

### 2. Backend (Jac)
Install dependencies and start the Jac server:
```bash
cd littleX_BE
pip install -r requirements.txt
jac build littleX.jac
jac serve littleX.jac
```
*The server will run on `http://localhost:8000`*

### 3. Frontend (Client)
In a new terminal, start the Next.js client:
```bash
cd littleX_FE
npm install
npm run dev
```
*The client will run on `http://localhost:3000`*

---

## 🧪 Verification & Testing

To verify the system integrity and logic:

```bash
cd littleX_BE
jac test verify_fixes.test.jac
```

## 🎥 Walkthrough
Check out `walkthrough.md` for a detailed log of recent changes and validation steps.

---

**Built with ❤️ using Jac & Jaseci**
