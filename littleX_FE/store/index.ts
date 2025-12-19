import tweetReducer from "./tweetSlice";
import { configureStore } from "@reduxjs/toolkit";
import usersReducer from "./userSlice";
import { analyticsReducer } from "@/modules/analytics";

export const store = configureStore({
  reducer: {
    users: usersReducer,
    tweet: tweetReducer,
    analytics: analyticsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
