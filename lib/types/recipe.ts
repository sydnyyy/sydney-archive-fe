import { BaseItem, CATEGORY, ITEM_TYPE } from "./base";

export interface RecipeItem extends BaseItem {
    cookTime?: string;
    ingredients?: string;
    steps?: string[];
}

export function createRecipeItem(
    item: Omit<RecipeItem, "category" | "type">
): RecipeItem {
    return {
        category: CATEGORY.FOOD,
        type: ITEM_TYPE.RECIPE,
        ...item,
    };
}

export function isRecipeItem(item: BaseItem): item is RecipeItem {
    return item.category === CATEGORY.FOOD
        && item.type === ITEM_TYPE.RECIPE;
}
