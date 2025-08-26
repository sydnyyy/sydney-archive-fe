import React from "react";
import { ChatMessage } from "@/types/chat";
import { formatKST } from "@/utils/data";

interface Props {
    msg: ChatMessage;
    adminId: string;
}

export default function MessageBubble({ msg, adminId }: Props) {
    const isAdmin = msg.sender === adminId;
    const displayTime = formatKST(msg.sendAt);

    return (
        <div className="mb-3">
            {isAdmin ? (
                <div className="flex items-end justify-end">
                    <span className="text-xs text-gray-500 mr-1">{displayTime}</span>
                    <div className="px-3 py-2 rounded-2xl bg-blue-400 text-white">
                        {msg.content}
                    </div>
                </div>
            ) : (
                <div className="flex items-end justify-start">
                    <div className="px-3 py-2 rounded-2xl bg-gray-200 text-black">
                        {msg.content}
                    </div>
                    <span className="text-xs text-gray-500 ml-1">{displayTime}</span>
                </div>
            )}
        </div>
    );
}