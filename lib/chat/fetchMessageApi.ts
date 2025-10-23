import { ChatMessage } from "@/types/chat";

export async function fetchMessagesApi(
    clientId: string,
    isAdmin: boolean,
    cursorId?: string
): Promise<ChatMessage[]> {
    const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
    const url = new URL(`${baseUrl}/api/chat/messages`);
    url.searchParams.append("clientId", clientId);
    url.searchParams.append("isAdmin", String(isAdmin));
    if (cursorId) url.searchParams.append("cursorId", cursorId);

    const res = await fetch(url.toString());
    if (!res.ok) {
        throw new Error("메시지 불러오기 실패");
    }

    return res.json();
}
