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
        throw new Error("아이템 목록 불러오기 실패");
    }

    return res.json();
}