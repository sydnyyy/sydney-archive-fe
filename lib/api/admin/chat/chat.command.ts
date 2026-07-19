import {httpRequestWithAuth} from "@/lib/api/admin/apiClient";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function deleteChatRoomApi(
    chatRoomId: string,
    accessToken: string,
    refreshAccessToken: () => Promise<string>
): Promise<void> {
    httpRequestWithAuth(
        `${API_BASE_URL}/api/admin/chat/${chatRoomId}`,
        {
            method: "DELETE",
            credentials: "include",
        },
        accessToken,
        refreshAccessToken
    );
}