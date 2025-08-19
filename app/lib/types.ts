export type ItemType = "상품" | "음식" | "레시피";

export interface BaseItem {
    id: number;
    type: ItemType;
    title: string;
}

export interface ProductItem extends BaseItem {
    type: "상품";
    image: string;
    link: string;
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