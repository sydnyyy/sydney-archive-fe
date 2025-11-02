import { useState } from "react";
import { ChatMessage } from "@/types/chat";
import { fetchMessagesApi } from "@/lib/chat/fetchMessageApi";

export const useChatMessages = () => {
    const [messages, setMessages] = useState<ChatMessage[]>([]);

    const loadMessages = async (
        clientId: string,
        isAdmin: boolean,
        cursorId?: string): Promise<ChatMessage[]> => {
        if (!clientId) return [];

        try {
            const data = await fetchMessagesApi(clientId, false, cursorId);

            if (cursorId) {
                setMessages(prev => {
                    const ids = new Set(prev.map(m => m.id));
                    const filtered = data.filter(m => !ids.has(m.id));
                    return [...filtered, ...prev];
                });
            } else {
                setMessages([...data]);
            }
            return data;
        } catch (err) {
            console.error("메시지 불러오기 실패", err);
            return [];
        }
    };

    const loadPreviousMessages = async (
        clientId: string,
        isAdmin: boolean = false
    ): Promise<ChatMessage[]> => {
        if (!messages.length) return [];
        const oldestMessage = messages[0];
        return await loadMessages(clientId, isAdmin, oldestMessage.id);
    };

    return { messages, setMessages, loadMessages, loadPreviousMessages };
}