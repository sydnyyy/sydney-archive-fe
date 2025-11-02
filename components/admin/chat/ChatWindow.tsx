"use client";

import { ChatMessage } from "@/types/chat";
import { useState, useRef, useEffect } from "react";
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

    const { loadMessages, loadPreviousMessages } = useChatMessages();

    useEffect(() => {
        if (!clientId) return;

        loadMessages(clientId, true).then((fetched) => {
            requestAnimationFrame(() => {
                setMessages(fetched);
                messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
            });
        });
    }, [clientId]);

    useEffect(() => {
        requestAnimationFrame(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        });
    }, [messages]);

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
        if (e.currentTarget.scrollTop === 0) {
            await loadPreviousMessages(clientId, true);
        }
    };

    return (
        <div className="flex flex-col flex-1 p-3 overflow-auto" onScroll={handleScroll}>
            <div className="flex-1 overflow-auto mb-2">
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