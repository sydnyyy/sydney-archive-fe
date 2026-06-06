export const ITEM_TYPE = {
    PRODUCT: "PRODUCT",
    RESTAURANT: "RESTAURANT",
    RECIPE: "RECIPE",
    BOOK: "BOOK",
    TRAVEL: "travel",
    ETC: "ETC"
} as const;

export type ItemType = typeof ITEM_TYPE[keyof typeof ITEM_TYPE];

export interface ProductInfo {
    name: string;
    price?: string;
    link: string;
    description?: string;
}

export interface Item {
    itemId: string;
    itemType: ItemType;
    title?: string;
    description?: string;

    imageUrls?: string[];
    thumbnailIndex?: number;

    permission: Permission
}

interface Permission {
    canEdit: boolean;
    canDelete: boolean;
}