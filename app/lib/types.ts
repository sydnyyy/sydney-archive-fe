export type ItemType = "상품" | "음식" | "레시피";

export interface BaseItem {
    id: number;
    type: ItemType;
    title: string;
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
    image: string;
    tags?: Tag[];
}

export interface FoodItem extends BaseItem {
    type: "음식";
    description?: string;
    location?: string;
}

export interface RecipeItem extends BaseItem {
    type: "레시피";
    description?: string;
}

export type Item = ProductItem | FoodItem | RecipeItem;