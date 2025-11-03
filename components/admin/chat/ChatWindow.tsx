"use client";

import { ChatMessage } from "@/types/chat";
import { useState, useRef, useEffect, useLayoutEffect } from "react";
import AdminAnimatedMessages from "@/components/admin/chat/AdminAnimatedMessages";
import { useChatMessages } from "@/hooks/useChatMessages";

interface Props {
    clientId: string;
    adminId: string;
    stompClient: any;
    messages: ChatMessage[];
    setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

export default function ChatWindow({
                                       clientId,
                                       adminId,
                                       stompClient,
                                       messages,
                                       setMessages, }: Props) {

    const [input, setInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const messagesContainerRef = useRef<HTMLDivElement | null>(null);
    const { loadMessages, loadPreviousMessages } = useChatMessages();
    const [isInitialLoadDone, setIsInitialLoadDone] = useState(false);

    const isAtBottomRef = useRef(true);
    const SCROLL_THRESHOLD = 50;

    // 최초 메시지 로딩
    useEffect(() => {
        if (!clientId) return;

        loadMessages(clientId, true).then((fetched) => {
            setMessages(fetched);
            setIsInitialLoadDone(true);
        });
    }, [clientId]);

    useLayoutEffect(() => {
        if (!isInitialLoadDone || !messagesEndRef.current || !messagesContainerRef.current) return;

        const container = messagesContainerRef.current;

        // 최초 로딩 시 하단 이동
        if (!container.dataset.initialScrolled) {
            messagesEndRef.current.scrollIntoView({ behavior: "auto" });
            container.dataset.initialScrolled = "true";
            return;
        }

        // 사용자가 하단에 있을 때만 새 메시지 수신 시 하단 이동
        // 사용자가 스크롤 위로 올렸으면 화면 유지 (스크롤바만 변경)
        if (isAtBottomRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isInitialLoadDone]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const chatMessage: ChatMessage = {
            sender: adminId,
            receiver: clientId,
            content: input.trim(),
            sendAt: new Date().toISOString(),
            type: "ADMIN",
        };

        stompClient?.publish({
            destination: "/app/chat.sendToUser",
            body: JSON.stringify(chatMessage),
        });

        setInput("");
    };

    const handleScroll = async (e: React.UIEvent<HTMLDivElement>) => {
        const container = e.currentTarget;
        messagesContainerRef.current = container;

        isAtBottomRef.current =
            container.scrollHeight - container.scrollTop - container.clientHeight < SCROLL_THRESHOLD;

        if (container.scrollTop === 0) {
            const prevHeight = container.scrollHeight;
            const older = await loadPreviousMessages(clientId, true);
            if (!older || older.length === 0) return;

            setMessages((prev) => [...older, ...prev]);

            requestAnimationFrame(() => {
                const newHeight = container.scrollHeight;
                container.scrollTop = newHeight - prevHeight;
            });
        }
    };

    return (
        <div className="flex flex-col flex-1 p-3 overflow-auto">
            <div
                className="flex-1 overflow-auto mb-2"
                onScroll={handleScroll}
                ref={messagesContainerRef}
            >
                {messages.map((msg) => (
                    <AdminAnimatedMessages key={msg.id} msg={msg} />
                ))}
                <div ref={messagesEndRef} />
            </div>

            <div className="flex gap-2 mt-2">
                <input
                    type="text"
                    className="flex-1 border rounded p-2"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendMessage()}
                />
                <button
                    onClick={sendMessage}
                    className="bg-[#6CA67C] text-[#FFFFFF] px-4 rounded"
                >
                    전송
                </button>
            </div>
        </div>
    );
}