
"use client";

import React, { useEffect, useState, useCallback } from "react";
import { useParams } from "next/navigation";
import { TweetNode } from "@/nodes/tweet-node";
import { CommunityApi } from "../services";
import { useCommunities } from "../hooks/useCommunities";
import { TweetCard } from "@/ds/organisms/tweet-card";
import { TweetForm } from "@/ds/organisms/tweet-form";
import { Skeleton } from "@/ds/atoms/skeleton";
import { RoomsList } from "../components/RoomsList";
import { ChatRoom } from "../components/ChatRoom";
import { Button } from "@/ds/atoms/button";
import { useAppSelector } from "@/store/useStore";

export const CommunityFeedPage = () => {
    const params = useParams();
    const communityId = params.id as string;
    const user = useAppSelector((state) => state.tweet.profile.user);

    const [tweets, setTweets] = useState<TweetNode[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [communityName, setCommunityName] = useState<string>("Community Feed");

    const fetchFeed = useCallback(async () => {
        if (!communityId) return;
        try {
            setIsLoading(true);
            const data = await CommunityApi.getCommunityFeed(communityId);

            // Transform data if needed, matching TweetCard expectations
            // API currently returns flat list of tweet info objects from backend
            // We need to ensure they match TweetNode interface
            const validTweets = data.map((t: any) => ({
                id: t.id,
                content: t.content,
                created_at: t.created_at,
                username: t.username || "User", // Fallback
                likes: t.likes || [],
                comments: t.comments || [],
                embedding: t.embedding || []
            } as TweetNode));

            setTweets(validTweets);

            // Also try to find community name from list (optimization)
            const myCommunities = await CommunityApi.getMyCommunities();
            const current = myCommunities.find(c => c.id === communityId);
            if (current) setCommunityName(current.name);

        } catch (error) {
            console.error("Failed to load community feed", error);
        } finally {
            setIsLoading(false);
        }
    }, [communityId]);

    const { communities, emerging, join, leave, refresh } = useCommunities();

    // Find current community status from the lists
    // Note: 'communities' contains joined ones (from getMyCommunities), 'emerging' contains unjoined?
    // Wait, getMyCommunities returns joined. Emerging returns unjoined?
    // The previous implementation of CommunityCard uses `community.joined`.
    // Let's assume we can confirm membership if it exists in 'communities' list (since it's getMyCommunities).
    // Or we need to fetch all communities?
    // CommunityApi.getMyCommunities only returns joined ones?
    // Let's check 'useCommunities'. It calls 'getMyCommunities' and 'getEmergingCommunities'.
    // If I am in a community, it should be in 'communities'.

    const isMember = communities.some(c => c.id === communityId);

    useEffect(() => {
        fetchFeed();
    }, [fetchFeed]);

    const [activeTab, setActiveTab] = useState<"feed" | "rooms">("feed");
    const [selectedRoom, setSelectedRoom] = useState<any>(null); // Type 'Room' if imported

    return (
        <div className="container mx-auto py-6 max-w-2xl space-y-6">
            <div className="border-b pb-4 flex justify-between items-start">
                <div>
                    <Button
                        variant="ghost"
                        className="mb-2 pl-0 hover:pl-2 transition-all"
                        onClick={() => window.history.back()}
                    >
                        ← Back
                    </Button>
                    <h1 className="text-2xl font-bold">{communityName}</h1>
                    <p className="text-muted-foreground">Community discussions and updates.</p>
                </div>
                {/* Join/Leave Button */}
                <Button
                    variant={isMember ? "outline" : "default"}
                    onClick={async () => {
                        if (isMember) {
                            await leave(communityId);
                            refresh();
                        } else {
                            await join(communityId);
                            refresh();
                        }
                    }}
                >
                    {isMember ? "Leave" : "Join"}
                </Button>
            </div>

            {/* Tabs */}
            <div className="flex border-b">
                <button
                    onClick={() => setActiveTab("feed")}
                    className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${activeTab === "feed"
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                >
                    Feed
                </button>
                <button
                    onClick={() => setActiveTab("rooms")}
                    className={`px-4 py-2 font-medium text-sm transition-colors border-b-2 ${activeTab === "rooms"
                        ? "border-primary text-primary"
                        : "border-transparent text-muted-foreground hover:text-foreground"
                        }`}
                >
                    Rooms
                </button>
            </div>

            {activeTab === "feed" ? (
                <>
                    <div className="bg-card rounded-lg border p-4">
                        <h3 className="text-sm font-semibold mb-2">Post to Community</h3>
                        <TweetForm
                            communityId={communityId}
                            onSuccess={() => setTimeout(fetchFeed, 1000)}
                        />
                    </div>

                    <div className="space-y-4">
                        {isLoading ? (
                            Array.from({ length: 3 }).map((_, i) => (
                                <Skeleton key={i} className="h-[200px] w-full rounded-xl" />
                            ))
                        ) : tweets.length > 0 ? (
                            tweets.map((tweet) => (
                                <TweetCard key={tweet.id} {...tweet} profile={user} />
                            ))
                        ) : (
                            <div className="text-center py-10 text-muted-foreground">
                                No posts yet. Be the first to share something!
                            </div>
                        )}
                    </div>
                </>
            ) : (
                /* Rooms Tab Content */
                <div>
                    {selectedRoom ? (
                        <ChatRoom
                            communityId={communityId}
                            roomId={selectedRoom.id}
                            roomName={selectedRoom.name}
                            onBack={() => setSelectedRoom(null)}
                        />
                    ) : (
                        <RoomsList
                            communityId={communityId}
                            onSelectRoom={setSelectedRoom}
                        />
                    )}
                </div>
            )}
        </div>
    );
};
