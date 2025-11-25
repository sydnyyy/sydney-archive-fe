import { AdminChatRoom } from "@/types/chat";
import { formatKST } from "@/utils/formatKSTShort";

interface Props {
    room: AdminChatRoom;
    selected: boolean;
    onClick: () => void;
}

export default function ChatRoomCard({ room, selected, onClick }: Props) {
    return (
        <div
            onClick={onClick}
            className={`
                min-w-[70px] min-h-[100px] flex flex-col justify-center p-4 rounded-xl cursor-pointer
                transition-all duration-100
            `}
            style={{
                borderColor: "var(--admin-chatroom-border)",
                boxShadow: "0 4px 12px var(--admin-chatroom-shadow)",
                backgroundColor: selected
                    ? "var(--admin-chatroom-bg-hover)"
                    : "var(--admin-chatroom-bg)",
                color: selected
                    ? "var(--admin-chatroom-text-selected)"
                    : "var(--admin-chatroom-text)",
            }}
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

        <p className="font-medium mb-2">
                ⏸️ {room.clientId} 님
            </p>
            <p className="text-xs mb-1">
                현재 문의 중인 상품 ID: {}
            </p>
            <p className="text-xs">
                마지막 채팅 시각 {formatKST(room.lastMessageAt)}
            </p>
        </div>
    );
}