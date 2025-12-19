import React, { useState, useEffect } from "react";
import { Plus, Hash } from "lucide-react";
import { Button } from "@/ds/atoms/button";
import { Input } from "@/ds/atoms/input";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from "@/ds/atoms/dialog"; // Adjust path. If standard shadcn/radix, might be just components/ui/dialog
import { RoomApi, Room } from "../services/RoomApi";
import { Loader2 } from "lucide-react";

interface RoomsListProps {
    communityId: string;
    onSelectRoom: (room: Room) => void;
}

export const RoomsList = ({ communityId, onSelectRoom }: RoomsListProps) => {
    const [rooms, setRooms] = useState<Room[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);
    const [newRoomName, setNewRoomName] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const fetchRooms = async () => {
        setIsLoading(true);
        const data = await RoomApi.getCommunityRooms(communityId);
        setRooms(data);
        setIsLoading(false);
    };

    useEffect(() => {
        fetchRooms();
    }, [communityId]);

    const handleCreateRoom = async () => {
        if (!newRoomName.trim()) return;

        setIsCreating(true);
        const room = await RoomApi.createRoom(communityId, newRoomName);
        setIsCreating(false);

        if (room) {
            setNewRoomName("");
            setIsDialogOpen(false);
            fetchRooms(); // Refresh list
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">Discussion Rooms</h3>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button size="sm" className="gap-1">
                            <Plus size={16} /> New Room
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Create a New Room</DialogTitle>
                        </DialogHeader>
                        <div className="py-4">
                            <Input
                                placeholder="Room Name (e.g., General, Announcements)"
                                value={newRoomName}
                                onChange={(e) => setNewRoomName(e.target.value)}
                            />
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Cancel</Button>
                            <Button onClick={handleCreateRoom} disabled={isCreating || !newRoomName.trim()}>
                                {isCreating ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                                Create
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {isLoading ? (
                <div className="space-y-2">
                    {[1, 2, 3].map(i => (
                        <div key={i} className="h-12 bg-muted/50 rounded-md w-full animate-pulse" />
                    ))}
                </div>
            ) : rooms.length > 0 ? (
                <div className="grid gap-2">
                    {rooms.map((room) => (
                        <button
                            key={room.id}
                            onClick={() => onSelectRoom(room)}
                            className="flex items-center gap-3 p-3 rounded-md hover:bg-muted transition-colors text-left border bg-card"
                        >
                            <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                                <Hash size={16} />
                            </div>
                            <div>
                                <div className="font-medium">{room.name}</div>
                                <div className="text-xs text-muted-foreground">
                                    Created {new Date(room.created_at).toLocaleDateString()}
                                </div>
                            </div>
                        </button>
                    ))}
                </div>
            ) : (
                <div className="text-center py-8 text-muted-foreground border rounded-md border-dashed">
                    No rooms yet. Create one to start discussing!
                </div>
            )}
        </div>
    );
};
