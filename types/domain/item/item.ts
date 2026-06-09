export interface ProductInfo {
    name: string;
    price?: string;
    link: string;
    description?: string;
}

export interface Item {
    itemId: string;
    title?: string;
    description?: string;

    imageUrls?: string[];
    thumbnailIndex?: number;

    permission: Permission
}

interface Permission {
    canEdit: boolean;
    canDelete: boolean;
}