import React from "react";

interface ChatRoomListProps {
    clients: string[];
    selectedClient: string | null;
    onSelect: (clientId: string) => void;
}

export default function ChatRoomList({ clients, selectedClient, onSelect }: ChatRoomListProps) {
    return (
        <div className="w-1/4 bg-gray-100 p-4 border-r">
            <h2 className="font-bold mb-2">채팅방 목록</h2>
            <ul>
                {[...new Set(clients)].map((cid, idx) => (
                    <li
                        key={`${cid}-${idx}`}
                        onClick={() => onSelect(cid)}
                        className={`cursor-pointer p-2 rounded ${
                            cid === selectedClient ? "bg-blue-200" : "hover:bg-gray-200"
                        }`}
                    >
                        {cid}
                    </li>
                ))}
            </ul>
        </div>
    );
}
