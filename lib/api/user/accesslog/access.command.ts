import {httpRequestWithAuth} from "@/lib/api/apiClient";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function sendAccessEventApi(
    itemId: string,
    accessToken: string,
    refreshAccessToken: () => Promise<string>
): Promise<void> {

    await httpRequestWithAuth(
        `${API_BASE_URL}/api/g/access/${itemId}`,
        {
            method: "POST",
            credentials: "include"
        },
        accessToken,
        refreshAccessToken
    );
}
