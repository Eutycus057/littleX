import { private_api } from "@/_core/api-client";

export interface Room {
    id: string;
    name: string;
    created_at: string;
}

export interface Message {
    id: string;
    content: string;
    sender: string;
    created_at: string;
}

export const RoomApi = {
    createRoom: async (community_id: string, name: string): Promise<Room | null> => {
        try {
            const response = await private_api.post("/walker/create_room", {
                community_id,
                name,
            });
            const reports = response.data?.reports || [];
            return reports[0] || null;
        } catch (error) {
            console.error("Create room error:", error);
            return null;
        }
    },

    getCommunityRooms: async (community_id: string): Promise<Room[]> => {
        try {
            const response = await private_api.post("/walker/get_community_rooms", {
                community_id,
            });
            const reports = response.data?.reports || [];
            return reports[0] || [];
        } catch (error) {
            console.error("Get rooms error:", error);
            return [];
        }
    },

    sendMessage: async (community_id: string, room_id: string, content: string): Promise<Message | null> => {
        try {
            const response = await private_api.post("/walker/send_message", {
                community_id,
                room_id,
                content,
            });
            const reports = response.data?.reports || [];
            return reports[0] || null;
        } catch (error) {
            console.error("Send message error:", error);
            return null;
        }
    },

    getRoomMessages: async (community_id: string, room_id: string): Promise<Message[]> => {
        try {
            const response = await private_api.post("/walker/get_room_messages", {
                community_id,
                room_id,
            });
            const reports = response.data?.reports || [];
            return reports[0] || [];
        } catch (error) {
            console.error("Get messages error:", error);
            return [];
        }
    },
};
