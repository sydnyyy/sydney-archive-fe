import { BaseItem, CATEGORY, ITEM_TYPE } from "./base";

export interface RestaurantItem extends BaseItem {
    link?: string;
    description?: string;
    location?: string;
}

export function createRestaurantItem(
    item: Omit<RestaurantItem, "category" | "type">
): RestaurantItem {
    return {
        category: CATEGORY.FOOD,
        type: ITEM_TYPE.RESTAURANT,
        ...item,
    };
}

export function isRestaurantItem(item: BaseItem): item is RestaurantItem {
    return item.category === CATEGORY.FOOD
        && item.type === ITEM_TYPE.RESTAURANT;
}
