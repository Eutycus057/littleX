import React, { useState, useEffect, useRef } from "react";
import { Send, Loader2 } from "lucide-react";
import { Button } from "@/ds/atoms/button"; // Adjust path if needed
import { Input } from "@/ds/atoms/input";   // Adjust path if needed
import { RoomApi, Message } from "../services/RoomApi";
import { cn } from "@/lib/utils"; // Assuming utils exists

interface ChatRoomProps {
    communityId: string;
    roomId: string;
    roomName: string;
    onBack: () => void;
}

export const ChatRoom = ({ communityId, roomId, roomName, onBack }: ChatRoomProps) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    // WebSocket Connection
    useEffect(() => {
        // Initial fetch
        const fetchMessages = async () => {
            try {
                const msgs = await RoomApi.getRoomMessages(communityId, roomId);
                setMessages(msgs);
            } catch (error) {
                console.error("Failed to fetch messages:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchMessages();

        // Setup WebSocket
        const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
        // Note: Hardcoding port 8000 for localhost dev env as typically React runs on 3000/5173 and Jac on 8000
        // In production this might need to be an env var or relative path if proxied
        const wsHost = window.location.hostname === 'localhost' ? 'localhost:8000' : window.location.host;
        const wsUrl = `${protocol}//${wsHost}/websocket?channel_id=${roomId}`;

        console.log("Connecting to WebSocket:", wsUrl);
        const ws = new WebSocket(wsUrl);

        ws.onopen = () => {
            console.log("WebSocket connected");
        };

        ws.onmessage = (event) => {
            try {
                const payload = JSON.parse(event.data);
                console.log("WS Message:", payload);
                // "chat" is the type we broadcasted from backend
                // logic handles both specific "chat" type or if we used generic "channel" type
                if (payload.type === "chat" || payload.type === "channel") {
                    const newMsg = payload.data;
                    // Avoid duplicates if valid ID exists
                    setMessages((prev) => {
                        if (prev.some(m => m.id === newMsg.id)) return prev;
                        return [...prev, newMsg];
                    });
                }
            } catch (err) {
                console.error("Error parsing WS message:", err);
            }
        };

        ws.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        return () => {
            ws.close();
        };
    }, [communityId, roomId]);

    // Auto-scroll to bottom on new messages
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [messages]);

    const handleSend = async () => {
        if (!newMessage.trim()) return;

        setIsSending(true);
        // Backend walker 'send_message' will broadcast the new message via WebSocket
        const result = await RoomApi.sendMessage(communityId, roomId, newMessage);

        if (result) {
            setNewMessage("");
            // No need to manually fetch or update state here; WebSocket will handle it
        }
        setIsSending(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="flex flex-col h-[600px] border rounded-lg bg-card overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b bg-muted/30">
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" onClick={onBack} className="md:hidden">
                        ←
                    </Button>
                    <div>
                        <h3 className="font-semibold text-lg">#{roomName}</h3>
                        <p className="text-xs text-muted-foreground">Live Discussion</p>
                    </div>
                </div>
            </div>

            {/* Messages Area */}
            <div
                className="flex-1 overflow-y-auto p-4 space-y-4"
                ref={scrollRef}
            >
                {isLoading ? (
                    <div className="flex justify-center py-10">
                        <Loader2 className="animate-spin text-muted-foreground" />
                    </div>
                ) : messages.length === 0 ? (
                    <div className="text-center py-10 text-muted-foreground text-sm">
                        No messages yet. Start the conversation!
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div key={msg.id} className="flex flex-col gap-1">
                            <div className="flex items-baseline gap-2">
                                <span className="font-semibold text-sm">{msg.sender}</span>
                                <span className="text-[10px] text-muted-foreground">
                                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                            <p className="text-sm text-foreground/90 bg-muted/50 p-2 rounded-md w-fit max-w-[85%] break-words">
                                {msg.content}
                            </p>
                        </div>
                    ))
                )}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t bg-background mt-auto">
                <div className="flex gap-2">
                    <Input
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={`Message #${roomName}`}
                        className="flex-1"
                        disabled={isSending}
                        autoComplete="off"
                    />
                    <Button
                        onClick={handleSend}
                        disabled={!newMessage.trim() || isSending}
                        size="icon"
                    >
                        {isSending ? <Loader2 className="animate-spin h-4 w-4" /> : <Send className="h-4 w-4" />}
                    </Button>
                </div>
            </div>
        </div>
    );
};
