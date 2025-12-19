class MockLLM:
    def generate(self, prompt: str) -> str:
        print(f"MockLLM received: {prompt}")
        if "hashtags" in prompt:
            return "#trending #mock #ai"
        if "Refine" in prompt:
            if "content: " in prompt:
                return prompt.split("content: ")[-1] + " (Polished)"
            return prompt + " (Polished)"
        if "Summarize" in prompt:
            return "Conversation summary (mock)."
        return "I am a helpful mock AI."
