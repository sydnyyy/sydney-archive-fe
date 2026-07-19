const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function deleteChatRoomApi(
    chatRoomId: string,
    accessToken: string,
): Promise<void> {
    fetch(
        `${API_BASE_URL}/api/admin/chat/${chatRoomId}`,
        {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Authorization": `Bearer ${accessToken}`
            }
        },
    );
}