
"use client";

import { Loader2 } from "lucide-react";

import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "@/store/useStore";
import { getEngagementMetricsAction, getContentPerformanceAction } from "@/modules/analytics";
import { Card, CardContent, CardHeader, CardTitle } from "@/ds/atoms/card";

export const AnalyticsDashboard = () => {
    const dispatch = useAppDispatch();
    const { metrics, performance, isLoading } = useAppSelector((state) => state.analytics);

    useEffect(() => {
        dispatch(getEngagementMetricsAction());
        dispatch(getContentPerformanceAction());
    }, [dispatch]);

    if (isLoading && !metrics) {
        return (
            <div className="flex items-center justify-center min-h-[400px]">
                <div className="flex flex-col items-center gap-2">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p className="text-muted-foreground animate-pulse">Analyzing data...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col gap-6 p-4">
            <h2 className="text-2xl font-bold">Analytics Dashboard</h2>

            {/* Overview Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Tweets</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics?.total_tweets || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Likes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics?.total_likes || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Comments</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics?.total_comments || 0}</div>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Followers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{metrics?.followers || 0}</div>
                    </CardContent>
                </Card>
            </div>

            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">Optimal Posting Time</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-xl font-bold text-green-600">{metrics?.optimal_time || "Not enough data"}</div>
                </CardContent>
            </Card>

            {/* Top Performing Content */}
            <Card className="col-span-4">
                <CardHeader>
                    <CardTitle>Top Performing Content</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {performance.length === 0 ? (
                            <p className="text-muted-foreground">No data available.</p>
                        ) : (
                            performance.map((item, index) => (
                                <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0">
                                    <div className="space-y-1">
                                        <p className="text-sm font-medium leading-none whitespace-normal break-words max-w-[300px]">{item.content}</p>
                                        <p className="text-xs text-muted-foreground">{item.created_at}</p>
                                    </div>
                                    <div className="flex items-center gap-4 text-sm">
                                        <div className="flex items-center gap-1">
                                            <span>❤️</span>
                                            <span>{item.likes}</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            <span>💬</span>
                                            <span>{item.comments}</span>
                                        </div>
                                        <div className="font-bold">Score: {item.engagement}</div>
                                        {item.virality_score && item.virality_score > 5.0 && (
                                            <div className="flex items-center gap-1 bg-gradient-to-r from-orange-500 to-red-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold shadow-sm animate-pulse">
                                                <span>🔥 Viral</span>
                                                <span className="hidden group-hover:inline ml-1">({item.virality_score})</span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
};
