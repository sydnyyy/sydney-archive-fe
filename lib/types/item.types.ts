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

export type Tag = {
    x: string;
    y: string;
    icon: string;
    label: string;
    link: string;
    labelX?: string;
    labelY?: string;
    color?: string;
    bgColor?: string;
};

export interface ProductInfo {
    name: string;
    price?: string;
    link: string;
    description?: string;
}

export interface BaseItem {
    id: string;
    category: CategoryType;
    type: ItemType;
    title: string;
    description?: string;
    images?: string[];
    tags?: Tag[];
    products?: ProductInfo[];
}