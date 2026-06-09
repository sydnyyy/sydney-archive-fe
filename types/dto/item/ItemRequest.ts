import {VisibilityStatus} from "@/types/domain/common/VisibilityStatus";

export interface ItemCreateRequest {
    title?: string;
    description: string;
    imageUrls?: string[];
    thumbnailIndex?: number;
    visibilityStatus: VisibilityStatus;
}

export interface ItemUpdateRequest {
    title?: string;
    description: string;
    imageUrls?: string[];
    thumbnailIndex?: number;
    visibilityStatus: VisibilityStatus;
}