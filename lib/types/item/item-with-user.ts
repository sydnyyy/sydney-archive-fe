import { Item } from "./item";

export interface ItemWithUser extends Item {
    userId: string;
    displayName: string;
    profileImageUrl?: string;
}