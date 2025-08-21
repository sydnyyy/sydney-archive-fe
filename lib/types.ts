export type ItemType = "상품" | "음식";

export interface BaseItem {
    id: number;
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
    type: "상품";
    tags?: Tag[];
}

export type FoodFormat = "음식점" | "레시피";

export interface FoodItem extends BaseItem {
    type: "음식";
    format: FoodFormat;
    link?: string; // 음식점 포맷에서 사용
    description?: string; // 음식점 포맷에서 사용
    location?: string;  // 음식점 포맷에서 사용

    cookTime?: string;   // 레시피 포맷에서 사용
    ingredients?: string; // 레시피 포맷에서 사용
    steps?: string[];     // 레시피 포맷에서 사용
}

export type Item = ProductItem | FoodItem;