"use client";
import { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { TweetNode } from "@/nodes/tweet-node";
import { useTweets } from ".";
import { useAppDispatch, useAppSelector } from "@/store/useStore";
import { createTweetAction, updateTweetAction, generateHashtagsAction, fetchTrendingTopicsAction } from "../actions";
import { fileToBase64 } from "../utils";

interface UseTweetFormProps {
  onSuccess?: () => void;
  initialContent?: string;
  mode?: "create" | "edit";
  tweetId?: string;
  communityId?: string;
}
const formSchema = z.object({
  content: z.string().nonempty("Content cannot be empty"),
});

type FormValues = z.infer<typeof formSchema>;

export function useTweetForm({
  onSuccess,
  initialContent,
  mode = "create",
  tweetId,
  communityId,
}: UseTweetFormProps = {}) {
  const dispatch = useAppDispatch();
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      content: initialContent || "",
    },
  });

  /* useEffect to reset form when initialContent changes (e.g. opening edit dialog) */
  useEffect(() => {
    if (initialContent) {
      form.reset({ content: initialContent });
    }
  }, [initialContent, form]);

  const { suggestedContent, isLoading } = useAppSelector((state) => state.tweet);
  useEffect(() => {
    if (suggestedContent) {
      // Append or replace? Let's replace for now based on "generated tweet based on..."
      // Or confirm with user. Assuming replace or fill if empty.
      // Let's set it.
      form.setValue("content", suggestedContent);
      // Dispatch action to clear it so it doesn't persist inappropriately
      dispatch({ type: 'tweet/clearSuggestedContent' });
    }
  }, [suggestedContent, form, dispatch]);

  // Import React hooks inside the custom hook
  // Assuming React is available globally or imported. But useCreateTweet.ts doesn't import React explicitly?
  // It uses "use client" so it's a component-compatible hook.
  // Wait, I need to check imports.

  const onSubmit = async (values: Pick<TweetNode, "content">, mediaFiles: File[] = []) => {
    // Process media files
    const media = {
      images: [] as string[],
      videos: [] as string[],
      docs: [] as string[],
    };

    for (const file of mediaFiles) {
      const base64 = await fileToBase64(file);
      if (file.type.startsWith("image/")) {
        media.images.push(base64);
      } else if (file.type.startsWith("video/")) {
        media.videos.push(base64);
      } else {
        media.docs.push(base64);
      }
    }

    if (mode === "edit" && tweetId) {
      await dispatch(
        updateTweetAction({
          id: tweetId,
          content: values.content,
        })
      );
    } else {
      // Pass object with content, communityId, and media
      await dispatch(createTweetAction({ content: values.content, communityId, media }));
      dispatch(fetchTrendingTopicsAction());
    }
    form.reset();
    if (onSuccess) onSuccess();
  };

  const handleGenerateHashtags = async () => {
    const currentContent = form.getValues("content");
    if (!currentContent) return;

    // We need to import generateHashtagsAction. 
    // Since I can't easily add import at top without messing lines, I'm assuming it's available or I add it.
    // Wait, I should add the import first.
    // For now, I'll add the function body assuming import exists.
    const result = await dispatch(generateHashtagsAction(currentContent)).unwrap();
    if (result && Array.isArray(result)) {
      const hashtags = result.join(" ");
      form.setValue("content", `${currentContent} \n${hashtags}`);
    }
  };

  return {
    form,
    onSubmit,
    handleGenerateHashtags,
    isLoading,
  };
}
