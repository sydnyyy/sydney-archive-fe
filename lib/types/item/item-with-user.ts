import { Item } from "./item";

export interface ItemWithUser extends Item {
    ownerDisplayName: string;
    ownerProfileImageUrl?: string;
}