
import React from "react";
import { Community } from "../services";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/ds/atoms/card";
import { Button } from "@/ds/atoms/button";
import { Users } from "lucide-react";

interface CommunityCardProps {
    community: Community;
    onJoin: (id: string) => void;
    onLeave: (id: string) => void;
    onClick: (id: string) => void;
}

export const CommunityCard: React.FC<CommunityCardProps> = ({
    community,
    onJoin,
    onLeave,
    onClick,
}) => {
    return (
        <Card
            className="w-full hover:bg-muted/50 transition-colors cursor-pointer"
            onClick={() => onClick(community.id)}
        >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-bold flex items-center gap-2">
                    <Users className="h-5 w-5 text-primary" />
                    {community.name}
                </CardTitle>
                <Button
                    variant={community.joined ? "outline" : "default"}
                    size="sm"
                    onClick={(e) => {
                        e.stopPropagation();
                        community.joined ? onLeave(community.id) : onJoin(community.id);
                    }}
                >
                    {community.joined ? "Leave" : "Join"}
                </Button>
            </CardHeader>
            <CardContent>
                <CardDescription>{community.description || "No description provided."}</CardDescription>
            </CardContent>
        </Card>
    );
};
