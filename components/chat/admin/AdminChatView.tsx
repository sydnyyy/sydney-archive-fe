"use client";

import { ChatMessage } from "@/types/chat";
import { useState, useEffect } from "react";
import AnimatedMessages from "@/components/chat/common/AnimatedMessages";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useChatScroll } from "@/hooks/useChatScroll";

interface AdminChatViewProps {
    clientId: string;
    adminId: string;
    stompClient: any;
    messages: ChatMessage[];
    setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

export default function AdminChatView({
                                       clientId,
                                       adminId,
                                       stompClient,
                                       messages,
                                       setMessages, }: AdminChatViewProps) {

    const [input, setInput] = useState("");
    const { loadMessages, loadPreviousMessages } = useChatMessages();
    const [isInitialLoadDone, setIsInitialLoadDone] = useState(false);

    const { messagesContainerRef, messagesEndRef, handleScroll } = useChatScroll(
        messages,
        isInitialLoadDone,
        () => loadPreviousMessages(clientId, true, messages),
        (older: ChatMessage[]) => setMessages((prev) => [...older, ...prev])
    );

    // 최초 메시지 로딩
    useEffect(() => {
        if (!clientId) return;

        loadMessages(clientId, true).then((fetched) => {
            setMessages(fetched);
            setIsInitialLoadDone(true);
        });
    }, [clientId]);

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

    return (
        <div className="flex flex-col flex-1 p-3 overflow-auto">
            <div
                className="flex-1 overflow-auto mb-2"
                onScroll={handleScroll}
                ref={messagesContainerRef}
            >
                <AnimatedMessages
                    messages={messages}
                    myRole="ADMIN"
                />
                <div ref={messagesEndRef} />
            </div>

            <form
                className="flex gap-2 mt-2"
                onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage();
                }}
            >
                <input
                    type="text"
                    className="flex-1 border rounded p-2"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button
                    type="submit"
                    className="bg-[#6CA67C] text-[#FFFFFF] px-4 rounded"
                >
                    전송
                </button>
            </form>
        </div>
    );
}