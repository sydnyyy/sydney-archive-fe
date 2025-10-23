export const ITEM_TYPE = {
    PRODUCT: "상품",
    FOOD: "음식",
} as const;

export type ItemType = typeof ITEM_TYPE[keyof typeof ITEM_TYPE];

export const FOOD_FORMAT = {
    RESTAURANT: "음식점",
    RECIPE: "레시피",
} as const;

export type FoodFormat = typeof FOOD_FORMAT[keyof typeof FOOD_FORMAT];

export interface BaseItem {
    id: string;
    type: ItemType;
    title: string;
    image: string;
}

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

export interface ProductItem extends BaseItem {
    type: typeof ITEM_TYPE.PRODUCT;
    tags?: Tag[];
}

export interface FoodItem extends BaseItem {
    type: typeof ITEM_TYPE.FOOD;
    format: FoodFormat;
    link?: string; // 음식점 포맷에서 사용
    description?: string; // 음식점 포맷에서 사용
    location?: string;  // 음식점 포맷에서 사용

    cookTime?: string;   // 레시피 포맷에서 사용
    ingredients?: string; // 레시피 포맷에서 사용
    steps?: string[];     // 레시피 포맷에서 사용
}

export type Item = ProductItem | FoodItem;