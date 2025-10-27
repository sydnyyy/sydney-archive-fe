import { useEffect, useRef } from "react";
import { ChatMessage } from "@/types/chat";
import { v4 as uuidv4 } from "uuid";

export default function useAutoReply(
    sendMessage: (message: ChatMessage) => void,
    isAdminJoinedRef: { current: boolean },
    clientId: string
) {
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const handleUserMessage = () => {
        if (isAdminJoinedRef.current) return;
        if (timerRef.current) clearTimeout(timerRef.current);

        timerRef.current = setTimeout(() => {
            if (!isAdminJoinedRef.current) {
                sendMessage({
                    id: uuidv4(),
                    sender: "SYSTEM",
                    receiver: clientId,
                    content: "문의 감사합니다. 곧 답변드리겠습니다 🙏",
                    sendAt: new Date().toISOString(),
                    type: "SYSTEM",
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

    return { handleUserMessage };
}