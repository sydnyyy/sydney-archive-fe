import { useEffect, useRef } from "react";
import {CHAT_TYPE, ChatMessage} from "@/types/domain/chat/chat";
import { v4 as uuidv4 } from "uuid";

export default function useAutoReply(
    uid: string,
    sendMessage: (message: ChatMessage) => void,
    isAdminJoinedRef: { current: boolean },
) {

    const timerRef = useRef<NodeJS.Timeout | null>(null);

    const addAutoReply = () => {
        if (isAdminJoinedRef.current || uid == null) return;
        if (timerRef.current) clearTimeout(timerRef.current);

        timerRef.current = setTimeout(() => {
            if (!isAdminJoinedRef.current) {
                sendMessage({
                    id: uuidv4(),
                    chatRoomId: uid,
                    senderUid: "system",
                    receiverUid: uid,
                    content: "곧 답변드리겠습니다 🙏",
                    createdAt: new Date().toISOString(),
                    type: CHAT_TYPE.SYSTEM,
                });
            }
            timerRef.current = null;
        }, 7000);
    };

    useEffect(() => {
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    return { addAutoReply };
}