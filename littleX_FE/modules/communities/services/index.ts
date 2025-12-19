
import { private_api } from "@/_core/api-client";
import { TweetNode } from "@/nodes/tweet-node";

export interface Community {
    id: string;
    name: string;
    description: string;
    joined: boolean;
    created_at?: string;
}

export const CommunityApi = {
    getMyCommunities: async (): Promise<Community[]> => {
        const { data } = await private_api.post("/walker/get_my_communities", {});
        return data.reports[0] || [];
    },

    createCommunity: async (name: string, description: string) => {
        const { data } = await private_api.post("/walker/create_community", {
            name,
            description,
        });
        return data.reports[0];
    },

    getEmergingCommunities: async (): Promise<Community[]> => {
        const { data } = await private_api.post("/walker/get_emerging_communities", {});
        return data.reports[0] || [];
    },

    joinCommunity: async (community_id: string) => {
        await private_api.post("/walker/join_community", { community_id });
    },

    leaveCommunity: async (community_id: string) => {
        await private_api.post("/walker/leave_community", { community_id });
    },

    getCommunityFeed: async (community_id: string): Promise<TweetNode[]> => {
        const { data } = await private_api.post("/walker/get_community_feed", {
            community_id,
        });
        return data.reports[0] || [];
    },
};
