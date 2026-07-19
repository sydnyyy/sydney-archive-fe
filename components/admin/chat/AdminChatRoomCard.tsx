import { AdminChatRoom } from "@/types/domain/chat/chat";
import { formatKST } from "@/utils/formatKSTShort";

interface Props {
    room: AdminChatRoom;
    selected: boolean;
    onClick: () => void;
}

export default function AdminChatRoomCard({ room, selected, onClick }: Props) {
    return (
        <div
            onClick={onClick}
            className={`
                min-w-[70px] min-h-[100px] 
                flex flex-col justify-center
                p-4 rounded-xl cursor-pointer
                transition-all duration-100
                ${
                    selected 
                        ? "bg-[var(--admin-chatroom-bg-hover)] text-[var(--admin-chatroom-text-selected)]" 
                        : "bg-[var(--admin-chatroom-bg)] text-[var(--admin-chatroom-text)]"
                }
            `}
            onMouseEnter={(e) => {
                if (!selected) {
                    const target = e.currentTarget as HTMLDivElement;
                    target.style.backgroundColor = "var(--admin-chatroom-bg-hover)";
                    target.style.color = "var(--admin-chatroom-text-selected)";
                }
            }}
            onMouseLeave={(e) => {
                if (!selected) {
                    const target = e.currentTarget as HTMLDivElement;
                    target.style.backgroundColor = "var(--admin-chatroom-bg)";
                    target.style.color = "var(--admin-chatroom-text)";
                }
            }}
        >
            <p className="text-sm mb-2">
                {room.chatRoomId}
            </p>
            <p className="text-sm mb-1">
                현재 문의 중인 상품 ID: {}
            </p>
            <p className="text-sm">
                마지막 채팅 시각 {formatKST(room.lastMessageAt)}
            </p>
        </div>
    );
}