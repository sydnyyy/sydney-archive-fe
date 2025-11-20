export const TAB_VALUES = {
    PRODUCT: "product",
    STUDY: "study",
    CHAT: "chat",
    WISHLIST: "wishlist",
    PROFILE: "profile",
} as const;

export type TabValue = typeof TAB_VALUES[keyof typeof TAB_VALUES];