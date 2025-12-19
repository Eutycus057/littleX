
import { useState, useEffect, useCallback } from "react";
import { Community, CommunityApi } from "../services";
import { toast } from "sonner";

export function useCommunities() {
    const [communities, setCommunities] = useState<Community[]>([]);
    const [emerging, setEmerging] = useState<Community[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchCommunities = useCallback(async () => {
        try {
            setIsLoading(true);
            const [myComms, emergingComms] = await Promise.all([
                CommunityApi.getMyCommunities(),
                CommunityApi.getEmergingCommunities(),
            ]);
            setCommunities(myComms);
            setEmerging(emergingComms);
        } catch (error) {
            console.error("Failed to fetch communities", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchCommunities();
    }, [fetchCommunities]);

    const join = async (id: string) => {
        try {
            await CommunityApi.joinCommunity(id);
            toast.success("Joined community");
            fetchCommunities(); // Refresh list to update 'joined' status
        } catch (e) {
            toast.error("Failed to join");
        }
    };

    const leave = async (id: string) => {
        try {
            await CommunityApi.leaveCommunity(id);
            toast.success("Left community");
            fetchCommunities();
        } catch (e) {
            toast.error("Failed to leave");
        }
    };

    const create = async (name: string, description: string) => {
        try {
            await CommunityApi.createCommunity(name, description);
            toast.success("Community created");
            fetchCommunities();
            return true;
        } catch (e) {
            toast.error("Failed to create community");
            return false;
        }
    };

    return {
        communities,
        emerging,
        isLoading,
        join,
        leave,
        create,
        refresh: fetchCommunities,
    };
}
