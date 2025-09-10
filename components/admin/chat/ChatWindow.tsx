"use client";

import { ChatMessage } from "@/types/chat";
import { useState } from "react";

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
                    <div
                        key={msg.id}
                        className={`p-2 rounded my-1 max-w-[70%] ${
                            msg.type === "ADMIN"
                                ? "bg-blue-100 self-end"
                                : "bg-gray-200 self-start"
                        }`}
                    >
                        {msg.content}
                    </div>
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
                    className="bg-blue-400 text-white px-4 rounded"
                >
                    전송
                </button>
            </div>
        </div>
    );
}
