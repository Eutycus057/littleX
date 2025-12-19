
import { createAsyncThunk } from "@reduxjs/toolkit";
import { AnalyticsApi } from "../services";

export const getEngagementMetricsAction = createAsyncThunk(
    "analytics/getEngagementMetrics",
    async (_, { rejectWithValue }) => {
        try {
            const response = await AnalyticsApi.getEngagementMetrics();
            return response;
        } catch (error) {
            return rejectWithValue(
                error instanceof Error ? error.message : "Failed to fetch metrics"
            );
        }
    }
);

export const getContentPerformanceAction = createAsyncThunk(
    "analytics/getContentPerformance",
    async (_, { rejectWithValue }) => {
        try {
            const response = await AnalyticsApi.getContentPerformance();
            return response;
        } catch (error) {
            return rejectWithValue(
                error instanceof Error ? error.message : "Failed to fetch performance"
            );
        }
    }
);
