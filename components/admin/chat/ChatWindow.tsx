"use client";

import { ChatMessage } from "@/types/chat";
import { useState } from "react";
import AdminAnimatedMessages from "@/components/admin/chat/AdminAnimatedMessages";

interface Props {
    messages: ChatMessage[];
    selectedClient: string;
    adminId: string;
    onSend: (content: string) => void;
}

export default function ChatWindow({ messages, onSend }: Props) {
    const [input, setInput] = useState("");

    const handleSend = () => {
        if (!input.trim()) return;
        onSend(input.trim());
        setInput("");
    };

    return (
        <div className="flex flex-col flex-1 p-3 overflow-auto">
            <div className="flex-1 overflow-auto mb-2">
                {messages.map((msg) => (
                    <AdminAnimatedMessages key={msg.id} msg={msg} />
                ))}
            </div>

            <div className="flex gap-2 mt-2">
                <input
                    type="text"
                    className="flex-1 border rounded p-2"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSend()}
                />
                <button
                    onClick={handleSend}
                    className="bg-[#6CA67C] text-[#FFFFFF] px-4 rounded"
                >
                    전송
                </button>
            </div>
        </div>
    );
}
