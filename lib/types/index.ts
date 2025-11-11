export * from "./base";
export * from "./product";
export * from "./restaurant";
export * from "./recipe";

import type { ProductItem } from "./product";
import type { RestaurantItem } from "./restaurant";
import type { RecipeItem } from "./recipe";

export type Item = ProductItem | RestaurantItem | RecipeItem;
