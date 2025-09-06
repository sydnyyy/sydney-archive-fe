import { AdminChatRoom } from "@/types/chat";

interface Props {
    room: AdminChatRoom;
    selected: boolean;
    onClick: () => void;
}

export default function ChatRoomCard({ room, selected, onClick }: Props) {
    return (
        <div
            onClick={onClick}
            className={`p-3 border rounded-lg cursor-pointer ${
                selected ? "bg-blue-100" : "hover:bg-gray-100"
            }`}
        >
            <p className="font-medium">👤 {room.clientId}</p>
            <p className="text-xs text-gray-400">{room.lastMessageAt}</p>
        </div>
    );
}
