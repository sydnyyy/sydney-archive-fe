export const VISIBILITY_STATUS = {
    PUBLIC: "PUBLIC",
    PRIVATE: "PRIVATE"
} as const;

export type VisibilityStatus = typeof VISIBILITY_STATUS[keyof typeof VISIBILITY_STATUS];