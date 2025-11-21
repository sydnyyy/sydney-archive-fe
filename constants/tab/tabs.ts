export const TAB_VALUES = {
    ITEM: "item",
    STUDY: "study",
    CHAT: "chat",
    WISHLIST: "wishlist",
    PROFILE: "profile",
} as const;

export type TabValue = typeof TAB_VALUES[keyof typeof TAB_VALUES];