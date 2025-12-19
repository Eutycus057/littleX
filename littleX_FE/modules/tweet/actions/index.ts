import { createAsyncThunk } from "@reduxjs/toolkit";
import { TweetApi } from "../services";

export const fetchTweetsAction = createAsyncThunk(
  "tweet/loadFeeds",
  async (_, { rejectWithValue }) => {
    try {
      const response = await TweetApi.getTweets();
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch Tweets"
      );
    }
  }
);
export const createTweetAction = createAsyncThunk(
  "tweet/create",
  async (payload: string | { content: string; communityId?: string; media?: { images: string[]; videos: string[]; docs: string[] } }, { rejectWithValue }) => {
    try {
      const content = typeof payload === "string" ? payload : payload.content;
      const communityId = typeof payload === "string" ? undefined : payload.communityId;
      const media = typeof payload === "string" ? undefined : payload.media;

      const response = await TweetApi.createTweet(content, communityId, media);

      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to create Tweet"
      );
    }
  }
);

export const searchTweetsAction = createAsyncThunk(
  "tweet/searchFeeds",
  async (query: string, { rejectWithValue }) => {
    try {
      const response = await TweetApi.searchTweets(query);
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch Tweets"
      );
    }
  }
);
export const updateTweetAction = createAsyncThunk(
  "tweet/update",
  async (data: { id: string; content: string }, { rejectWithValue }) => {
    try {
      const response = await TweetApi.updateTweet(data);

      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to update Tweet"
      );
    }
  }
);

export const likeTweetAction = createAsyncThunk(
  "tweet/like",

  async (data: { id: string; username: string }, { rejectWithValue }) => {
    try {
      const response = await TweetApi.likeTweet(data.id, data.username);

      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to like Tweet"
      );
    }
  }
);

export const removeLikeAction = createAsyncThunk(
  "tweet/removeLike",
  async (data: { id: string; username: string }, { rejectWithValue }) => {
    try {
      const response = await TweetApi.removeLike(data.id, data.username);

      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to remove Like"
      );
    }
  }
);

export const loadUserProfilesAction = createAsyncThunk(
  "tweet/loadUserProfiles",
  async (_, { rejectWithValue }) => {
    try {
      const response = await TweetApi.loadUserProfiles();

      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to load User Profiles"
      );
    }
  }
);
export const deleteTweetAction = createAsyncThunk(
  "tweet/delete",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await TweetApi.deleteTweet(id);

      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to delete Tweet"
      );
    }
  }
);

export const getUserProfileAction = createAsyncThunk(
  "user/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const response = await TweetApi.getProfile();

      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to load User Profiles"
      );
    }
  }
);

export const updateUserProfileAction = createAsyncThunk(
  "user/updateProfile",
  async (username: string, { rejectWithValue }) => {
    try {
      const response = await TweetApi.updateProfile(username);

      if ("error" in response) {
        return rejectWithValue(response.error);
      }
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to update User Profile"
      );
    }
  }
);

export const followRequestAction = createAsyncThunk(
  "user/follow",

  async (id: string, { rejectWithValue }) => {
    try {
      const response = await TweetApi.followRequest(id);

      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to follow use"
      );
    }
  }
);

export const unFollowRequestAction = createAsyncThunk(
  "user/unfollow",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await TweetApi.unFollowRequest(id);

      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to unfollow user"
      );
    }
  }
);

export const addCommentAction = createAsyncThunk(
  "tweet/addComment",
  async (
    {
      tweetId,
      username,
      content,
    }: { tweetId: string; username: string; content: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await TweetApi.addCommentTweet(
        tweetId,
        username,
        content
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to add comment"
      );
    }
  }
);

export const updateCommentAction = createAsyncThunk(
  "tweet/updateComment",
  async (
    {
      tweetId,
      id,
      username,
      content,
    }: { tweetId: string; id: string; username: string; content: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await TweetApi.updateCommentTweet(
        tweetId,
        id,
        username,
        content
      );
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to update comment"
      );
    }
  }
);

export const deleteCommentAction = createAsyncThunk(
  "tweet/deleteComment",
  async (
    { tweetId, id }: { tweetId: string; id: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await TweetApi.deleteCommentTweet(tweetId, id);
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to delete comment"
      );
    }
  }
);

export const fetchTrendingTopicsAction = createAsyncThunk(
  "tweet/fetchTrendingTopics",
  async (_, { rejectWithValue }) => {
    try {
      const response = await TweetApi.getTrendingTopics();
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to fetch Trending Topics"
      );
    }
  }
);

export const generateHashtagsAction = createAsyncThunk(
  "tweet/generateHashtags",
  async (content: string, { rejectWithValue }) => {
    try {
      const response = await TweetApi.generateHashtags(content);
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to generate hashtags"
      );
    }
  }
);

export const smartReplyAction = createAsyncThunk(
  "tweet/smartReply",
  async (context: string, { rejectWithValue }) => {
    try {
      const response = await TweetApi.smartReply(context);
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to generate smart reply"
      );
    }
  }
);

export const summarizeThreadAction = createAsyncThunk(
  "tweet/summarizeThread",
  async (comments: string[], { rejectWithValue }) => {
    try {
      const response = await TweetApi.summarizeThread(comments);
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to summarize thread"
      );
    }
  }
);

export const refineTweetAction = createAsyncThunk(
  "tweet/refineTweet",
  async (content: string, { rejectWithValue }) => {
    try {
      const response = await TweetApi.refineTweet(content);
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to refine tweet"
      );
    }
  }
);

export const suggestTweetContentAction = createAsyncThunk(
  "tweet/suggestContent",
  async (_, { rejectWithValue }) => {
    try {
      const response = await TweetApi.suggestTweetContent();
      return response;
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : "Failed to suggest tweet content"
      );
    }
  }
);
