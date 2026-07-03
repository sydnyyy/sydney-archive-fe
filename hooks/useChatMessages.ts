import { ChatMessage } from "@/types/domain/chat/chat";
import {fetchMessagesApi} from "@/lib/api/chat/chat.query";

export const useChatMessages = () => {

    const loadMessages = async (
        sid: string,
        cursorId?: string
    ): Promise<ChatMessage[]> => {
        if (!sid) return [];

        try {
            return await fetchMessagesApi(sid, cursorId);
        } catch (err) {
            console.error("메시지 불러오기 실패", err);
            return [];
        }
    };

    const loadPreviousMessages = async (
        sid: string,
        messages: ChatMessage[],
    ): Promise<ChatMessage[]> => {
        if (!messages.length) return [];
        const oldestMessage = messages[0];
        const previousMessages = await loadMessages(sid, oldestMessage.id);

        const ids = new Set(messages.map(m => m.id));
        return previousMessages.filter(m => !ids.has(m.id));
    };

    return { loadMessages, loadPreviousMessages };
}