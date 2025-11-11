import { BaseItem, CATEGORY, ITEM_TYPE, Tag } from "./base";

export interface ProductInfo {
    name: string;
    price: string;
    link: string;
    description?: string;
}

export interface ProductItem extends BaseItem {
    tags?: Tag[];
    products: ProductInfo[];
}

export function createProductItem(
    item: Omit<ProductItem, "category" | "type">
): ProductItem {
    return {
        category: CATEGORY.PRODUCT,
        type: ITEM_TYPE.PRODUCT,
        ...item,
    };
}

export function isProductItem(item: BaseItem): item is ProductItem {
    return item.category === CATEGORY.PRODUCT
        && item.type === ITEM_TYPE.PRODUCT;
}