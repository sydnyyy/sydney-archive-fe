"use client";

import { useEffect, useState } from "react";
import AdminChatRoomCard from "@/components/admin/chat/AdminChatRoomCard";
import AdminChatModal from "@/components/admin/chat/AdminChatModal";
import { AdminChatRoom, ChatMessage } from "@/types/domain/chat/chat";

interface Props {
    adminSid: string;
    stompClient: any;
    messages: ChatMessage[];
    setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

export default function AdminChatManagement({
                                                adminSid,
                                                stompClient,
                                                messages,
                                                setMessages }: Props) {
    const [chatRooms, setChatRooms] = useState<AdminChatRoom[]>([]);
    const [chatUserSid, setChatUserSid] = useState<string | null>(null);

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
                    <AdminChatRoomCard
                        key={room.userSid}
                        room={room}
                        selected={chatUserSid === room.userSid}
                        onClick={() => setChatUserSid(room.userSid)}
                    />
                ))}
            </div>

            {chatUserSid && (
                <AdminChatModal
                    userSid={chatUserSid}
                    adminSid={adminSid}
                    stompClient={stompClient}
                    messages={messages}
                    setMessages={setMessages}
                    onClose={() => setChatUserSid(null)}
                />
            )}
        </div>
    );
}
