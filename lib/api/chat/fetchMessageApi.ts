import { ChatMessage } from "@/types/chat";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchMessagesApi(
    sid: string,
    isAdmin: boolean,
    cursorId?: string
): Promise<ChatMessage[]> {

    const url = new URL(`${API_BASE_URL}/api/chat/messages`);
    url.searchParams.append("sid", sid);
    url.searchParams.append("isAdmin", String(isAdmin));
    if (cursorId) {
        url.searchParams.append("cursorId", cursorId);
    }

    const res = await fetch(url.toString());
    if (!res.ok) {
        throw new Error("메시지 불러오기 실패");
    }

    return res.json();
}
