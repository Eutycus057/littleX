
import { private_api } from "@/_core/api-client";

export interface EngagementMetrics {
    total_tweets: number;
    total_likes: number;
    total_comments: number;
    followers: number;
    following: number;
    optimal_time?: string;
}

export interface ContentPerformance {
    content: string;
    engagement: number;
    likes: number;
    comments: number;
    created_at: string;
    virality_score?: number;
}

export const AnalyticsApi = {
    getEngagementMetrics: async (): Promise<EngagementMetrics> => {
        const { data } = await private_api.post("/walker/get_engagement_metrics", {});
        return data.reports[0];
    },

    getContentPerformance: async (): Promise<ContentPerformance[]> => {
        const { data } = await private_api.post("/walker/get_content_performance", {});
        return data.reports[0] || [];
    },
};
