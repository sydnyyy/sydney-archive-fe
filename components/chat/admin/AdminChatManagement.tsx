"use client";

import { useEffect, useState } from "react";
import ChatRoomCard from "@/components/chat/admin/ChatRoomCard";
import ChatModal from "@/components/chat/admin/ChatModal";
import { AdminChatRoom, ChatMessage } from "@/types/chat";

interface Props {
    adminId: string;
    stompClient: any;
    messages: ChatMessage[];
    setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

export default function AdminChatManagement({
                                                adminId,
                                                stompClient,
                                                messages,
                                                setMessages }: Props) {
    const [chatRooms, setChatRooms] = useState<AdminChatRoom[]>([]);
    const [modalClient, setModalClient] = useState<string | null>(null);

    useEffect(() => {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        fetch(`${baseUrl}/api/admin/chat/users`)
            .then((res) => res.json())
            .then((data: AdminChatRoom[]) => setChatRooms(data))
            .catch((err) => console.error("채팅방 불러오기 실패:", err));
    }, []);

    return (
        <div className="p-6">
            <div className="grid grid-cols-3 gap-4">
                {chatRooms.map((room) => (
                    <ChatRoomCard
                        key={room.sid}
                        room={room}
                        selected={modalClient === room.sid}
                        onClick={() => setModalClient(room.sid)}
                    />
                ))}
            </div>

            {modalClient && (
                <ChatModal
                    sid={modalClient}
                    adminId={adminId}
                    stompClient={stompClient}
                    messages={messages}
                    setMessages={setMessages}
                    onClose={() => setModalClient(null)}
                />
            )}
        </div>
    );
}
