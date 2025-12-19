"use client";

import { useState, useRef } from "react";
import { Button } from "@/ds/atoms/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/ds/atoms/form";

import { Textarea } from "@/ds/atoms/textarea";

import { useTweetForm } from "@/modules/tweet/hooks/useCreateTweet";
import { useAutocomplete } from "@/modules/tweet/hooks/useAutocomplete";
import { Loader2, Smile, PaperclipIcon, SendHorizonalIcon, Sparkles, PenLine, X, Lightbulb } from "lucide-react";
import EmojiPicker, { EmojiClickData } from "emoji-picker-react";
import { Popover, PopoverContent, PopoverTrigger } from "@/ds/atoms/popover";

import { useAppDispatch } from "@/store/useStore";
import { refineTweetAction } from "@/modules/tweet";

interface TweetFormProps {
  onSuccess?: () => void;
  communityId?: string;
}

export function TweetForm({ onSuccess, communityId }: TweetFormProps) {
  const { form, onSubmit, handleGenerateHashtags, isLoading } = useTweetForm({ onSuccess, communityId });
  const { suggestion, loading: imgLoading, fetchSuggestion, clearSuggestion } = useAutocomplete();
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const dispatch = useAppDispatch();
  const [isRefining, setIsRefining] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);

  const onEmojiClick = (emojiData: EmojiClickData) => {
    const current = form.getValues("content");
    form.setValue("content", current + emojiData.emoji);
  };

  const handleFileClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files.length > 0) {
      setSelectedFiles((prev) => [...prev, ...Array.from(event.target.files!)]);
    }
    // Reset input value to allow selecting same file again
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const removeFile = (indexToRemove: number) => {
    setSelectedFiles((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleRefine = async () => {
    const currentContent = form.getValues("content");
    if (!currentContent?.trim()) return;

    setIsRefining(true);
    try {
      const refined = await dispatch(refineTweetAction(currentContent)).unwrap();
      if (refined) {
        form.setValue("content", refined);
      }
    } catch (error) {
      console.error("Failed to refine tweet", error);
    } finally {
      setIsRefining(false);
    }
  };

  return (
    <div className="w-full border-b pb-4 px-4">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((values) => {
            onSubmit(values, selectedFiles);
            setSelectedFiles([]);
          })}
          className="flex items-start gap-3 w-full"
        >
          {/* Paperclip icon */}
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
            accept="image/*,video/*,.pdf,.doc,.docx,.txt"
            multiple
          />
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-10 w-10 mt-1 rounded-full p-0 text-muted-foreground hover:text-foreground"
            onClick={handleFileClick}
          >
            <PaperclipIcon size={20} />
          </Button>

          {/* Main form content */}
          <div className="flex-1 relative">
            <FormField
              control={form.control}
              name="content"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <div className="relative">
                      <Textarea
                        placeholder="What's on your mind right now?"
                        className="w-full !min-h-11 bg-transparent border-0 px-0 py-3 text-base placeholder:text-card-foreground resize-none focus-visible:ring-0 focus-visible:ring-offset-0 focus-visible:outline-none"
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          if (e.target.value.length > 5 && e.target.value.endsWith(" ")) {
                            fetchSuggestion(e.target.value);
                          } else {
                            clearSuggestion();
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Tab" && suggestion) {
                            e.preventDefault();
                            form.setValue("content", field.value + suggestion);
                            clearSuggestion();
                          }
                        }}
                      />
                      {suggestion && (
                        <div className="absolute top-14 left-0 text-muted-foreground/50 text-sm pointer-events-none flex items-center gap-1 animate-in fade-in slide-in-from-top-1">
                          <Lightbulb size={12} className="text-yellow-500" />
                          <span>Simulating AI... Press <kbd className="border px-1 rounded bg-muted/20">Tab</kbd> to add: "... {suggestion.slice(0, 20)}..."</span>
                        </div>
                      )}

                      {/* Ghost overlay for simulation (optional, simplifies to just tooltip above) */}
                      {isRefining && (
                        <div className="absolute inset-0 bg-background/50 flex items-center justify-center">
                          <Loader2 className="animate-spin text-purple-500" />
                        </div>
                      )}
                    </div>
                  </FormControl>
                  {selectedFiles.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedFiles.map((file, index) => (
                        <div key={index} className="relative inline-block">
                          {file.type.startsWith("image/") ? (
                            <img
                              src={URL.createObjectURL(file)}
                              alt={file.name}
                              className="h-20 w-auto rounded-md object-cover border border-border"
                            />
                          ) : file.type.startsWith("video/") ? (
                            <video
                              src={URL.createObjectURL(file)}
                              className="h-20 w-auto rounded-md object-cover border border-border"
                              controls={false}
                            />
                          ) : (
                            <div className="h-20 w-20 flex items-center justify-center bg-muted rounded-md border border-border text-xs text-center p-1 break-words overflow-hidden">
                              {file.name}
                            </div>
                          )}
                          <button
                            type="button"
                            onClick={() => removeFile(index)}
                            className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-0.5 shadow-sm hover:bg-destructive/90"
                          >
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Action buttons row */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="h-10 w-10 -ml-2 rounded-full p-0 text-muted-foreground hover:text-foreground"
                    >
                      <Smile size={20} />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0 border-none shadow-none bg-transparent" align="start">
                    <EmojiPicker onEmojiClick={onEmojiClick} />
                  </PopoverContent>
                </Popover>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-10 w-10 rounded-full p-0 text-muted-foreground hover:text-purple-500"
                  onClick={handleGenerateHashtags}
                  title="Magic Hashtags"
                >
                  <Sparkles size={20} />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="h-10 w-10 rounded-full p-0 text-muted-foreground hover:text-blue-500"
                  onClick={handleRefine}
                  title="Polish with AI"
                  disabled={isRefining}
                >
                  <PenLine size={20} />
                </Button>
              </div>

              {/* Post button */}
              <Button
                type="submit"
                className="rounded-full px-4 font-bold text-sm"
                disabled={form.formState.isSubmitting || isRefining || isLoading}
              >
                {form.formState.isSubmitting || isLoading ? (
                  <Loader2 size={20} className="animate-spin mr-2" />
                ) : null}
                <span className="-mb-1">Post</span>
                <SendHorizonalIcon size={20} className="ml-2" />
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
