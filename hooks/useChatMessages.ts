import { ChatMessage } from "@/types/chat";
import { fetchMessagesApi } from "@/lib/api/chat/fetchMessageApi";

export const useChatMessages = () => {

    const loadMessages = async (
        clientId: string,
        isAdmin: boolean,
        cursorId?: string): Promise<ChatMessage[]> => {
        if (!clientId) return [];

        try {
            return await fetchMessagesApi(clientId, isAdmin, cursorId);
        } catch (err) {
            console.error("메시지 불러오기 실패", err);
            return [];
        }
    };

    const loadPreviousMessages = async (
        clientId: string,
        isAdmin: boolean = false,
        messages: ChatMessage[],
    ): Promise<ChatMessage[]> => {
        if (!messages.length) return [];
        const oldestMessage = messages[0];
        const previousMessages = await loadMessages(clientId, isAdmin, oldestMessage.id);

        const ids = new Set(messages.map(m => m.id));
        return previousMessages.filter(m => !ids.has(m.id));
    };

    return { loadMessages, loadPreviousMessages };
}