"use client";

import { useEffect, useState, useRef } from "react";
import FixedHeader from "@/components/admin/FixedHeader";
import CategorySidebar from "@/components/admin/CategorySidebar";
import ChatRoomCard from "@/components/admin/chat/ChatRoomCard";
import ChatModal from "@/components/admin/chat/ChatModal";
import { AdminChatRoom, ChatMessage } from "@/types/chat";
import { createStompClient } from "@/lib/chat/socketClient";

const categories = ["상품 관리", "채팅 관리"] as const;
type Category = typeof categories[number];

export default function AdminPage() {
    const [activeCategory, setActiveCategory] = useState<Category>("상품 관리");
    const [chatRooms, setChatRooms] = useState<AdminChatRoom[]>([]);
    const [modalClient, setModalClient] = useState<string | null>(null);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const adminId = "wishlist-admin";

    const stompClientRef = useRef<any>(null);

    // 관리자 화면 진입 시 웹소켓 연결
    useEffect(() => {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        stompClientRef.current = createStompClient({
            url: `${baseUrl}/ws?client_id=admin`,
            role: "admin",
            subscribePaths: [
                {
                    path: "/topic/admin.chat",
                    onMessage: (msg: ChatMessage) => {
                        setMessages((prev) => [...prev, msg]);
                    },
                },
            ],
        });

        return () => {
            stompClientRef.current?.deactivate();
        };
    }, []);

    // 카테고리 선택 시 처리
    const handleCategorySelect = (category: Category) => {
        setActiveCategory(category);

        if (category === "채팅 관리") {
            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            fetch(`${baseUrl}/api/admin/chat/users`)
                .then((res) => res.json())
                .then((data: AdminChatRoom[]) => setChatRooms(data))
                .catch((err) => console.error("채팅방 불러오기 실패:", err));
        }
    };

    const handleSendMessage = (content: string) => {
        if (!modalClient) return;
        const chatMessage: ChatMessage = {
            id: crypto.randomUUID(),
            sender: adminId,
            receiver: modalClient,
            content,
            sendAt: new Date().toISOString(),
            type: "ADMIN",
        };

        // 웹소켓으로 전송
        stompClientRef.current?.publish({
            destination: "/app/chat.send",
            body: JSON.stringify(chatMessage),
        });

        setMessages((prev) => [...prev, chatMessage]);
    };

    return (
        <div className="flex flex-col h-screen">
            {/* 상단 고정 문구 */}
            <FixedHeader />

            <div className="flex flex-1 mt-25 overflow-hidden pt-8">
                {/* 왼쪽 카테고리 */}
                <div className="w-60 bg-gray-100 p-4 flex flex-col gap-4">
                    <CategorySidebar
                        categories={[...categories]}
                        activeCategory={activeCategory}
                        onSelect={handleCategorySelect}
                    />
                </div>

                {/* 오른쪽 콘텐츠 */}
                <div className="flex-1 p-6 overflow-auto">
                    {activeCategory === "상품 관리" && (
                        <div>상품 관리 화면 (추후 컴포넌트 추가)</div>
                    )}

                    {activeCategory === "채팅 관리" && (
                        <div className="grid grid-cols-3 gap-4">
                            {chatRooms.map((room) => (
                                <ChatRoomCard
                                    key={room.clientId}
                                    room={room}
                                    selected={modalClient === room.clientId}
                                    onClick={() => setModalClient(room.clientId)}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* 채팅 모달 */}
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
