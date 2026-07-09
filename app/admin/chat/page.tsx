"use client";

import {useAdminAuth} from "@/app/providers/admin/AdminAuthProvider";
import {useAdminWebSocket} from "@/app/providers/admin/AdminWebSocketProvider";
import {useEffect, useState} from "react";
import {AdminChatRoom, ChatMessage} from "@/types/domain/chat/chat";
import {fetchChatUserListApi} from "@/lib/api/chat/chat.query";
import AdminChatRoomCard from "@/components/admin/chat/AdminChatRoomCard";
import AdminChatModal from "@/components/admin/chat/AdminChatModal";

export default function AdminChatPage() {

    const { admin, accessToken } = useAdminAuth();
    const { stompClient, chatMessage } = useAdminWebSocket();

    const [chatRooms, setChatRooms] = useState<AdminChatRoom[]>([]);
    const [selectedChatRoomId, setSelectedChatRoomId] = useState<string | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    useEffect(() => {
        if (!accessToken) return;

        const fetchChatRooms = async() => {
            try {
                const res = await fetchChatUserListApi(accessToken);
                setChatRooms(res);

                if (selectedChatRoomId !== null && selectedChatRoomId === chatMessage?.chatRoomId) {
                    setMessages((prev) => [...prev, chatMessage]);
                }
            } catch (error) {
                console.error(error);
            }
        };
        fetchChatRooms();
    }, [accessToken, chatMessage]);

    if (!admin) return;

    return (
        <>
            <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-2 gap-3">
                    {chatRooms.map((room) => (
                        <AdminChatRoomCard
                            key={room.chatRoomId}
                            room={room}
                            selected={selectedChatRoomId === room.chatRoomId}
                            onClick={() => setSelectedChatRoomId(room.chatRoomId)}
                        />
                    ))}
                </div>
            </div>

            {selectedChatRoomId && (
                <AdminChatModal
                    chatRoomId={selectedChatRoomId}
                    adminSid={admin.sid}
                    stompClient={stompClient}
                    messages={messages}
                    setMessages={setMessages}
                    onClose={() => setSelectedChatRoomId(null)}
                />
            )}
        </>
    );
}