import { ChatMessage } from "@/types/domain/chat/chat";
import {fetchMessagesApi} from "@/lib/api/user/chat/chat.query";

export const useChatMessages = () => {

    const loadMessages = async (
        uid: string,
        cursorId?: string
    ): Promise<ChatMessage[]> => {
        if (!uid) return [];

        try {
            return await fetchMessagesApi(uid, cursorId);
        } catch (err) {
            console.error("메시지 불러오기 실패", err);
            return [];
        }
    };

    const loadPreviousMessages = async (
        uid: string,
        messages: ChatMessage[],
    ): Promise<ChatMessage[]> => {
        if (!messages.length) return [];
        const oldestMessage = messages[0];
        const previousMessages = await loadMessages(uid, oldestMessage.id);

        const ids = new Set(messages.map(m => m.id));
        return previousMessages.filter(m => !ids.has(m.id));
    };

    return { loadMessages, loadPreviousMessages };
}