import React from "react";
import { ChatRoom } from "@/types/chat";

interface ChatRoomListProps {
    chatRooms: ChatRoom[];
    selectedClient: string | null;
    onSelect: (clientId: string) => void;
}

export default function ChatRoomList({ chatRooms, selectedClient, onSelect }: ChatRoomListProps) {
    return (
        <div className="w-1/4 bg-gray-100 p-4 border-r">
            <h2 className="font-bold mb-2">채팅방 목록</h2>
            <ul>
                {chatRooms.map((room) => (
                    <li
                        key={room.clientId}
                        onClick={() => onSelect(room.clientId)}
                        className={`cursor-pointer p-2 rounded ${
                            room.clientId === selectedClient ? "bg-blue-200" : "hover:bg-gray-200"
                        }`}
                    >
                        {room.clientId}
                    </li>
                ))}
            </ul>
        </div>
    );
}
