
"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { useCommunities } from "../hooks/useCommunities";
import { CommunityCard } from "../components/CommunityCard";
import { CreateCommunityModal } from "../components/CreateCommunityModal";
import { Skeleton } from "@/ds/atoms/skeleton";

export const CommunitiesPage = () => {
    const router = useRouter();
    const { communities, emerging, isLoading, join, leave, create } = useCommunities();

    return (
        <div className="container mx-auto py-6 space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Communities</h1>
                    <p className="text-muted-foreground">
                        Discover and join interest groups.
                    </p>
                </div>
                <CreateCommunityModal onCreate={create} />
            </div>

            {/* Public Section */}
            <div className="space-y-4">
                <h2 className="text-2xl font-semibold tracking-tight">Open Discussions 🌐</h2>
                <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-1">
                    <CommunityCard
                        community={{
                            id: "public",
                            name: "Public Square",
                            description: "Join the global conversation. Create and join rooms open to everyone!",
                            joined: true, // Always show as joined for public square
                        }}
                        onJoin={() => { }}
                        onLeave={() => { }}
                        onClick={(id) => router.push(`/communities/${id}`)}
                    />
                </div>
                <div className="border-t pt-4"></div>
            </div>

            {/* Emerging Section */}
            {emerging.length > 0 && (
                <div className="space-y-4">
                    <h2 className="text-2xl font-semibold tracking-tight">Emerging Communities 🚀</h2>
                    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                        {emerging.map((community) => (
                            <CommunityCard
                                key={community.id}
                                community={community}
                                onJoin={join}
                                onLeave={leave}
                                onClick={(id) => router.push(`/communities/${id}`)}
                            />
                        ))}
                    </div>
                    <div className="border-t pt-4"></div>
                </div>
            )}

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {isLoading ? (
                    Array.from({ length: 6 }).map((_, i) => (
                        <Skeleton key={i} className="h-[150px] w-full rounded-xl" />
                    ))
                ) : communities.length > 0 ? (
                    communities.map((community) => (
                        <CommunityCard
                            key={community.id}
                            community={community}
                            onJoin={join}
                            onLeave={leave}
                            onClick={(id) => router.push(`/communities/${id}`)}
                        />
                    ))
                ) : (
                    <div className="col-span-full text-center py-12 text-muted-foreground">
                        No communities found. Be the first to create one!
                    </div>
                )}
            </div>
        </div>
    );
};
