import {AdminChatRoom, ChatMessage} from "@/types/domain/chat/chat";
import {httpRequestWithAuth} from "@/lib/api/apiClient";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchChatRoomListApi(
    accessToken: string,
    refreshAccessToken: () => Promise<string>
): Promise<AdminChatRoom[]> {
    return httpRequestWithAuth(
        `${API_BASE_URL}/api/a/chat/rooms`,
        {
            method: "GET",
            credentials: "include",
        },
        accessToken,
        refreshAccessToken
    ).then(res => {
        return res.json() as Promise<AdminChatRoom[]>;
    });
}

export async function fetchChatMessagesForAdminApi(
    userId: string,
    accessToken: string,
    refreshAccessToken: () => Promise<string>,
    cursorId?: string
): Promise<ChatMessage[]> {

    const url = new URL(`${API_BASE_URL}/api/a/chat/messages`);
    url.searchParams.append("userid", userId);
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
