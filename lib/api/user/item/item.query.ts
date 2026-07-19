import { Item } from "@/types/domain/item/item";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchItemsApi(
    accessToken?: string | null
): Promise<Item[]> {
    const res = await fetch(
        `${API_BASE_URL}/api/items`,
        {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                ...(accessToken && { "Authorization": `Bearer ${accessToken}` })
            }
        });

    if (!res.ok) {
        const errorData: ApiErrorResponse = await res.json();
        const error = new Error(errorData.message || "Failed to fetch items.");
        (error as any).code = errorData.code;
        (error as any).status = errorData.status;
        throw error;
    }

    return res.json();
}