import {ChatMessage} from "@/types/domain/chat/chat";
import {fetchMyChatMessages} from "@/lib/api/user/chat/chat.query";
import {UserRole} from "@/types/domain/user/user";
import {fetchChatMessagesForAdminApi} from "@/lib/api/admin/chat/chat.query";

export const useChatMessages = () => {

    const loadMessages = async (
        userId: string,
        accessToken: string,
        refreshAccessToken: () => Promise<string>,
        role: UserRole,
        cursorId?: string
    ): Promise<ChatMessage[]> => {
        try {
            if (role == UserRole.GUEST) {
                return await fetchMyChatMessages(accessToken, refreshAccessToken, cursorId);
            }
            return await fetchChatMessagesForAdminApi(userId, accessToken, refreshAccessToken, cursorId);
        } catch (err) {
            console.error("메시지 불러오기 실패", err);
            return [];
        }
    };

    const loadPreviousMessages = async (
        userId: string,
        accessToken: string,
        refreshAccessToken: () => Promise<string>,
        role: UserRole,
        messages: ChatMessage[],
    ): Promise<ChatMessage[]> => {
        if (!messages.length) return [];

        const oldestMessage = messages[0];
        const previousMessages
            = await loadMessages(userId, accessToken, refreshAccessToken, role, oldestMessage.id);

        const ids = new Set(messages.map(m => m.id));
        return previousMessages.filter(m => !ids.has(m.id));
    };

    return { loadMessages, loadPreviousMessages };
}