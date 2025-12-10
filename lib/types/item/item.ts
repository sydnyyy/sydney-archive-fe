export const ITEM_TYPE = {
    PRODUCT: "product",
    RESTAURANT: "restaurant",
    RECIPE: "recipe",
} as const;

export type ItemType = typeof ITEM_TYPE[keyof typeof ITEM_TYPE];

export interface ProductInfo {
    name: string;
    price?: string;
    link: string;
    description?: string;
}

export interface Item {
    id: string;
    type: ItemType;
    title: string;
    description?: string;
    images?: string[];
    thumbnailIndex?: number;
    products?: ProductInfo[];
}