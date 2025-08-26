"use client";

import { useEffect, useState, useRef } from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import ChatRoomList from "@/app/admin/ChatRoomList";
import ChatWindow from "@/app/admin/ChatWindow";
import { ChatMessage } from "@/types/chat";

export default function AdminPage() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [selectedClient, setSelectedClient] = useState<string | null>(null);
    const [clients, setClients] = useState<string[]>([]);
    const stompClientRef = useRef<Client | null>(null);

    const adminId = "wishlist-admin";

    useEffect(() => {
        const client = new Client({
            webSocketFactory: () => new SockJS("http://localhost:8080/ws"),
            reconnectDelay: 5000,
            onConnect: () => {
                console.log("🟢 Admin STOMP 연결 성공");

                client.subscribe("/topic/admin.chat", (message) => {
                    const chatMessage: ChatMessage = JSON.parse(message.body);
                    setMessages((prev) => [...prev, chatMessage]);

                    setClients((prev) =>
                        prev.includes(chatMessage.sender) ? prev : [...prev, chatMessage.sender]
                    );
                });
            },
        });

        client.activate();
        stompClientRef.current = client;

        return () => {
            client.deactivate();
            stompClientRef.current = null;
        };
    }, []);

    const sendMessage = (content: string) => {
        if (!selectedClient) return;

        const chatMessage: ChatMessage = {
            sender: adminId,
            receiver: selectedClient,
            content,
            sendAt: new Date().toISOString(),
            type: "ADMIN",
        };

        stompClientRef.current?.publish({
            destination: "/app/chat.sendToUser",
            body: JSON.stringify(chatMessage),
        });

        setMessages((prev) => [...prev, chatMessage]);
    };

    return (
        <div className="flex h-screen">
            <ChatRoomList
                clients={clients}
                selectedClient={selectedClient}
                onSelect={setSelectedClient}
            />
            {selectedClient ? (
                <ChatWindow
                    messages={messages}
                    selectedClient={selectedClient}
                    adminId={adminId}
                    onSend={sendMessage}
                />
            ) : (
                <div className="flex-1 flex items-center justify-center text-gray-600">
                    왼쪽에서 채팅방을 선택하세요
                </div>
            )}
        </div>
    );
}
