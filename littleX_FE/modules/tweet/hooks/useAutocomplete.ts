import { useState, useCallback, useEffect } from "react";
import { TweetApi } from "@/modules/tweet/services";

export function useAutocomplete() {
    const [suggestion, setSuggestion] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const fetchSuggestion = useCallback(async (text: string) => {
        if (!text || text.length < 5) {
            setSuggestion(null);
            return;
        }

        // Debounce/limit logic could be here, but for now we'll trigger manually or on pause
        setLoading(true);
        try {
            const result = await TweetApi.autocompleteText(text);
            if (result && result.startsWith(text)) {
                // If result includes original text, just take the suffix
                setSuggestion(result.slice(text.length));
            } else {
                setSuggestion(result);
            }
        } catch (e) {
            console.error(e);
            setSuggestion(null);
        } finally {
            setLoading(false);
        }
    }, []);

    const clearSuggestion = useCallback(() => setSuggestion(null), []);

    return { suggestion, loading, fetchSuggestion, clearSuggestion };
}
