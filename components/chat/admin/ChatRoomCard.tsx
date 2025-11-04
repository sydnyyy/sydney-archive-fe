import { AdminChatRoom } from "@/types/chat";
import { useState } from "react";
import { formatKST } from "@/utils/formatKSTShort";

interface Props {
    room: AdminChatRoom;
    selected: boolean;
    onClick: () => void;
}

export default function ChatRoomCard({ room, selected, onClick }: Props) {
    const [isHover, setIsHover] = useState(false);

    const backgroundColor = isHover ? "#B8D1C5" : "#E1E8E5";

    return (
        <div
            onClick={onClick}
            onMouseEnter={() => setIsHover(true)}
            onMouseLeave={() => setIsHover(false)}
            style={{
                backgroundColor,
                border: "1px solid #D1D5DB",
                borderRadius: "0.75rem",
                padding: "1rem 1.5rem",
                cursor: "pointer",
                minWidth: "70px",
                minHeight: "100px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
                transition: "all 0.1s ease-in-out",
            }}
        >
            <p style={{ fontWeight: 500, marginBottom: "0.5rem" }}>⏸️ {room.clientId} 님</p>
            <p style={{ fontSize: "0.75rem", color: "#687069", marginBottom: "0.1rem" }}>
                현재 문의 중인 상품 ID: {}
            </p>
            <p style={{ fontSize: "0.75rem", color: "#687069" }}>
                마지막 채팅 시각 {formatKST(room.lastMessageAt)}
            </p>
        </div>
    );
}