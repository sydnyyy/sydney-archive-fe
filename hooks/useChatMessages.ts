import { ChatMessage } from "@/types/domain/chat/chat";
import { fetchMessagesApi } from "@/lib/api/chat/fetchMessageApi";

export const useChatMessages = () => {

    const loadMessages = async (
        sid: string,
        isAdmin: boolean,
        cursorId?: string): Promise<ChatMessage[]> => {
        if (!sid) return [];

        try {
            return await fetchMessagesApi(sid, isAdmin, cursorId);
        } catch (err) {
            console.error("메시지 불러오기 실패", err);
            return [];
        }
    };

    const loadPreviousMessages = async (
        sid: string,
        isAdmin: boolean = false,
        messages: ChatMessage[],
    ): Promise<ChatMessage[]> => {
        if (!messages.length) return [];
        const oldestMessage = messages[0];
        const previousMessages = await loadMessages(sid, isAdmin, oldestMessage.id);

        const ids = new Set(messages.map(m => m.id));
        return previousMessages.filter(m => !ids.has(m.id));
    };

    return { loadMessages, loadPreviousMessages };
}