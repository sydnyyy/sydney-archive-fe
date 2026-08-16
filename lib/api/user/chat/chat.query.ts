import {ChatMessage} from "@/types/domain/chat/chat";
import {httpRequestWithAuth} from "@/lib/api/apiClient";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchMyChatMessages(
    accessToken: string,
    refreshAccessToken: () => Promise<string>,
    cursorId?: string
): Promise<ChatMessage[]> {

    const url = new URL(`${API_BASE_URL}/api/g/chat/messages`);
    if (cursorId) {
        url.searchParams.append("cursorId", cursorId);
    }

    return await httpRequestWithAuth(
        url.toString(),
        {
            method: "GET",
            credentials: "include",
        },
        accessToken,
        refreshAccessToken
    ).then(res => {
        return res.json() as Promise<ChatMessage[]>;
    });
}
