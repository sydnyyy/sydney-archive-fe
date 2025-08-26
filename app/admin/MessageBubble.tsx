import React from "react";
import { ChatMessage } from "@/types/chat";

interface Props {
    msg: ChatMessage;
    adminId: string;
}

export default function MessageBubble({ msg, adminId }: Props) {
    const isAdmin = msg.sender === adminId;

    return (
        <div
            className={`p-3 rounded max-w-xs
            ${
                isAdmin ? "bg-blue-400 text-white self-end ml-auto" : "bg-gray-200"
            }`}
        >
            {msg.content}
        </div>
    );
}