
import { createSlice } from "@reduxjs/toolkit";
import { EngagementMetrics, ContentPerformance } from "./services";
import { getEngagementMetricsAction, getContentPerformanceAction } from "./actions";

interface AnalyticsState {
    metrics: EngagementMetrics | null;
    performance: ContentPerformance[];
    isLoading: boolean;
    error: string | null;
}

const initialState: AnalyticsState = {
    metrics: null,
    performance: [],
    isLoading: false,
    error: null,
};

const analyticsSlice = createSlice({
    name: "analytics",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            // Engagement Metrics
            .addCase(getEngagementMetricsAction.pending, (state) => {
                state.isLoading = true;
                state.error = null;
            })
            .addCase(getEngagementMetricsAction.fulfilled, (state, action) => {
                state.isLoading = false;
                state.metrics = action.payload;
            })
            .addCase(getEngagementMetricsAction.rejected, (state, action) => {
                state.isLoading = false;
                state.error = action.payload as string;
            })
            // Content Performance
            .addCase(getContentPerformanceAction.pending, (state) => {
                // Optional: granular loading state if needed
            })
            .addCase(getContentPerformanceAction.fulfilled, (state, action) => {
                state.performance = action.payload;
            })
            .addCase(getContentPerformanceAction.rejected, (state, action) => {
                // Handle error
            });
    },
});

export default analyticsSlice.reducer;
