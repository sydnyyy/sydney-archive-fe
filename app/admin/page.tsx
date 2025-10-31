"use client";

import { useEffect, useState, useRef } from "react";
import FixedHeader from "@/components/admin/FixedHeader";
import CategorySidebar from "@/components/admin/CategorySidebar";
import AdminChatManagement from "@/components/admin/chat/AdminChatManagement";
import { ChatMessage } from "@/types/chat";
import { createStompClient } from "@/lib/chat/socketClient";
import { getOrCreateTabId } from "@/utils/clientId";

const categories = ["상품 관리", "채팅 관리"] as const;
type Category = typeof categories[number];

export default function AdminPage() {
    const [activeCategory, setActiveCategory] = useState<Category>("상품 관리");
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const stompClientRef = useRef<any>(null);
    const adminId = "wishlist-admin";

    // 관리자 화면 진입 시 웹소켓 연결
    useEffect(() => {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        const tabId = getOrCreateTabId();

        stompClientRef.current = createStompClient({
            url: `${baseUrl}/ws?client_id=admin&tab_id=${tabId}`,
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

    return (
        <div className="flex flex-col h-screen">
            <FixedHeader />

            <div className="flex flex-1 mt-25 overflow-hidden pt-8">
                {/* 왼쪽 카테고리 */}
                <div className="w-60 bg-gray-100 p-4 flex flex-col gap-4">
                    <CategorySidebar
                        categories={[...categories]}
                        activeCategory={activeCategory}
                        onSelect={setActiveCategory}
                    />
                </div>

                {/* 오른쪽 콘텐츠 */}
                <div className="flex-1 p-6 overflow-auto">
                    {activeCategory === "상품 관리" && (
                        <div>상품 관리 화면 (추후 컴포넌트 추가)</div>
                    )}

                    {activeCategory === "채팅 관리" && (
                        <AdminChatManagement
                            adminId={adminId}
                            stompClient={stompClientRef.current}
                            messages={messages}
                            setMessages={setMessages}
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
