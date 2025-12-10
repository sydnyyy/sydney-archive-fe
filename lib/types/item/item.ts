export const CATEGORY = {
    PRODUCT: "product",
    FOOD: "food",
} as const;

export type CategoryType = typeof CATEGORY[keyof typeof CATEGORY];

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
    category: CategoryType;
    type: ItemType;
    title: string;
    description?: string;
    images?: string[];
    thumbnailIndex?: number;
    products?: ProductInfo[];
}