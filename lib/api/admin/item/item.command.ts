import { Item } from "@/types/domain/item/item";
import {ItemCreateRequest, ItemUpdateRequest} from "@/types/dto/item/ItemRequest";
import {httpRequestWithAuth} from "@/lib/api/admin/apiClient";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function createItemApi(
    itemCreateRequest: ItemCreateRequest,
    accessToken: string,
    refreshAccessToken: () => Promise<string>
): Promise<Item> {
    return await httpRequestWithAuth(
        `${API_BASE_URL}/api/items`,
        {
            method: "POST",
            credentials: "include",
            body: JSON.stringify(itemCreateRequest)
        },
        accessToken,
        refreshAccessToken
    ).then(response => {
        return response.json() as Promise<Item>;
    });
}

export async function updateItemApi(
    itemId: string,
    itemUpdateRequest: ItemUpdateRequest,
    accessToken: string,
    refreshAccessToken: () => Promise<string>
): Promise<Item> {
    return await httpRequestWithAuth(
        `${API_BASE_URL}/api/items/${itemId}`,
        {
            method: "PUT",
            credentials: "include",
            body: JSON.stringify(itemUpdateRequest)
        },
        accessToken,
        refreshAccessToken
    ).then(response => {
        return response.json() as Promise<Item>;
    });
}

export async function deleteItemApi(
    itemId: string,
    accessToken: string,
    refreshAccessToken: () => Promise<string>
): Promise<void> {
    await httpRequestWithAuth(
        `${API_BASE_URL}/api/items/${itemId}`,
        {
            method: "DELETE",
            credentials: "include"
        },
        accessToken,
        refreshAccessToken
    )
}