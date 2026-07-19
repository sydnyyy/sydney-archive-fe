import {Item} from "@/types/domain/item/item";
import {httpRequestWithAuth} from "@/lib/api/admin/apiClient";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchItemsApi(
    accessToken: string,
    refreshAccessToken: () => Promise<string>
): Promise<Item[]> {
    return httpRequestWithAuth(
        `${API_BASE_URL}/api/items`,
        {
            method: "GET",
            credentials: "include",
        },
        accessToken,
        refreshAccessToken
    ).then(response => {
        return response.json() as Promise<Item[]>;
    });
}