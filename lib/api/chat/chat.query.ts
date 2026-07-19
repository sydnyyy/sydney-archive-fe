import {AdminChatRoom, ChatMessage} from "@/types/domain/chat/chat";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchMessagesApi(
    sid: string,
    cursorId?: string
): Promise<ChatMessage[]> {

    const url = new URL(`${API_BASE_URL}/api/chat/messages`);
    url.searchParams.append("sid", sid);
    if (cursorId) {
        url.searchParams.append("cursorId", cursorId);
    }

    const res = await fetch(url.toString());
    if (!res.ok) {
        const errorData: ApiErrorResponse = await res.json();
        const error = new Error(errorData.message || "채팅 메시지 조회 실패");
        (error as any).code = errorData.code;
        (error as any).status = errorData.status;
        throw error;
    }

    return res.json();
}
