export interface ItemCreateRequest {
    title?: string;
    description: string;
    imageUrls?: string[];
    thumbnailIndex?: number;
}

export interface ItemUpdateRequest {
    title?: string;
    description: string;
    imageUrls?: string[];
    thumbnailIndex?: number;
}