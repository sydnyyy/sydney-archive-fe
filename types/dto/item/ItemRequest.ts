import {ItemType} from "@/types/domain/item/item";

export interface ItemCreateRequest {
    itemType: ItemType;
    title?: string;
    description: string;
    imageUrls?: string[];
    thumbnailIndex?: number;
}

export interface ItemUpdateRequest {
    itemType: ItemType;
    title?: string;
    description: string;
    imageUrls?: string[];
    thumbnailIndex?: number;
}