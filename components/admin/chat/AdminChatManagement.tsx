"use client";

import { useEffect, useState } from "react";
import ChatRoomCard from "@/components/admin/chat/ChatRoomCard";
import ChatModal from "@/components/admin/chat/ChatModal";
import { AdminChatRoom, ChatMessage } from "@/types/chat";
import { fetchMessagesApi } from "@/lib/chat/fetchMessageApi";

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
                                           setMessages,
                                       }: Props) {
    const [chatRooms, setChatRooms] = useState<AdminChatRoom[]>([]);
    const [modalClient, setModalClient] = useState<string | null>(null);

    useEffect(() => {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        fetch(`${baseUrl}/api/admin/chat/users`)
            .then((res) => res.json())
            .then((data: AdminChatRoom[]) => setChatRooms(data))
            .catch((err) => console.error("채팅방 불러오기 실패:", err));
    }, []);

    const handleSendMessage = (content: string) => {
        if (!modalClient) return;

        const chatMessage: ChatMessage = {
            sender: adminId,
            receiver: modalClient,
            content,
            sendAt: new Date().toISOString(),
            type: "ADMIN",
        };

        stompClient?.publish({
            destination: "/app/chat.sendToUser",
            body: JSON.stringify(chatMessage),
        });
    };

    const handleOpenModal = async (clientId: string) => {
        setModalClient(clientId);

        try {
            const fetchedMessages = await fetchMessagesApi(clientId, true);
            setMessages((prev) => {
                const existingIds = new Set(prev.map((m) => m.id));
                const newMessages = fetchedMessages.filter((m) => !existingIds.has(m.id));
                return [...prev, ...newMessages];
            });
        } catch (err) {
            console.error("메시지 불러오기 실패:", err);
        }
    };

    return (
        <div className="p-6">
            <div className="grid grid-cols-3 gap-4">
                {chatRooms.map((room) => (
                    <ChatRoomCard
                        key={room.clientId}
                        room={room}
                        selected={modalClient === room.clientId}
                        onClick={() => handleOpenModal(room.clientId)}
                    />
                ))}
            </div>

            {modalClient && (
                <ChatModal
                    clientId={modalClient}
                    adminId={adminId}
                    messages={messages.filter(
                        (msg) => msg.sender === modalClient || msg.receiver === modalClient
                    )}
                    onSend={handleSendMessage}
                    onClose={() => setModalClient(null)}
                />
            )}
        </div>
    );
}
