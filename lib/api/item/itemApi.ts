import { ItemWithUser } from "@/lib/types/item/item-with-user";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchItemApi(): Promise<ItemWithUser[]> {
    const res = await fetch(`${API_BASE_URL}/api/items`, {
        method: "GET",
    });

    if (!res.ok) {
        throw new Error("아이템 목록 불러오기 실패");
    }

    return res.json();
}