import React, { useState } from "react";
import { ChatMessage } from "@/types/chat";
import MessageBubble from "./MessageBubble";

interface ChatWindowProps {
    messages: ChatMessage[];
    selectedClient: string;
    adminId: string;
    onSend: (message: string) => void;
}

export default function ChatWindow({
                                       messages,
                                       selectedClient,
                                       adminId,
                                       onSend,
                                   }: ChatWindowProps) {
    const [inputMessage, setInputMessage] = useState("");

    const send = () => {
        if (!inputMessage.trim()) return;
        onSend(inputMessage);
        setInputMessage("");
    };

    return (
        <div className="flex-1 flex flex-col">
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
                {messages
                    .filter((m) => {
                        if (m.type === "SYSTEM") {
                            return m.receiver === selectedClient;
                        }
                        return (
                            (m.sender === selectedClient && m.receiver === adminId) ||
                            (m.sender === adminId && m.receiver === selectedClient)
                        );
                    })
                    .map((msg, idx) => (
                        <MessageBubble key={idx} msg={msg} adminId={adminId} />
                    ))}
            </div>

            <form
                onSubmit={(e) => {
                    e.preventDefault();
                    send();
                }}
                className="p-5 border-t flex gap-3"
            >
                <input
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    className="flex-2 border rounded px-3 py-3"
                    placeholder="메시지 입력..."
                />
                <button
                    type="submit"
                    className="bg-blue-400 text-white px-6 py-3 rounded">
                    전송
                </button>
            </form>
        </div>
    );
}

