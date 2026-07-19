import {AdminChatRoom} from "@/types/domain/chat/chat";
import {httpRequestWithAuth} from "@/lib/api/admin/apiClient";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchChatUserListApi(
    accessToken: string,
    refreshAccessToken: () => Promise<string>
): Promise<AdminChatRoom[]> {
    return httpRequestWithAuth(
        `${API_BASE_URL}/api/admin/chat/rooms`,
        {
            method: "GET",
            credentials: "include",
        },
        accessToken,
        refreshAccessToken
    ).then(response => {
        return response.json() as Promise<AdminChatRoom[]>;
    });
}