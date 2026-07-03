"use client";

import {useAdminAuth} from "@/app/providers/AdminAuthProvider";
import {useWebSocket} from "@/app/providers/AdminWebSocketProvider";
import {useEffect, useState} from "react";
import {AdminChatRoom, ChatMessage} from "@/types/domain/chat/chat";
import {fetchChatUserListApi} from "@/lib/api/chat/chat.query";
import AdminChatRoomCard from "@/components/admin/chat/AdminChatRoomCard";
import AdminChatModal from "@/components/admin/chat/AdminChatModal";

export default function AdminChatPage() {

    const { admin, accessToken } = useAdminAuth();
    const { stompClient, chatMessage } = useWebSocket();

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
        <div className="h-screen w-screen flex flex-col overflow-hidden relative">
            <main className="flex-1 overflow-y-auto p-6">

                <div className="w-full max-w-[540px] mx-auto flex flex-col gap-4">
                    <p className="text-lg">
                        채팅 페이지
                    </p>

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
                </div>
            </main>
        </div>
    );
}