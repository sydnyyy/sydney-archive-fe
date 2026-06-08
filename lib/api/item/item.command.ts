import { Item } from "@/types/domain/item/item";
import {ItemCreateRequest, ItemUpdateRequest} from "@/types/dto/item/ItemRequest";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function createItemApi(
    itemCreateRequest: ItemCreateRequest,
    accessToken: string
): Promise<Item> {
    const res = await fetch(
        `${API_BASE_URL}/api/items`,
        {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify(itemCreateRequest)
        });

    if (!res.ok) {
        throw new Error("아이템 생성 실패");
    }

    return res.json();
}

export async function updateItemApi(
    itemId: string,
    itemUpdateRequest: ItemUpdateRequest,
    accessToken: string
): Promise<Item> {
    const res = await fetch(
        `${API_BASE_URL}/api/items/${itemId}`,
        {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify(itemUpdateRequest)
        });

    if (!res.ok) {
        throw new Error("아이템 업데이트 실패");
    }

    return res.json();
}

export async function deleteItemApi(
    itemId: string,
    accessToken: string
): Promise<void> {
    const res = await fetch(
        `${API_BASE_URL}/api/items/${itemId}`,
        {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            }
        });

    if (!res.ok) {
        throw new Error("아이템 삭제 실패");
    }
}