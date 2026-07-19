"use client";

import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Item } from "@/types/domain/item/item";
import { useAdminAuth } from "@/app/providers/admin/AdminAuthProvider";
import AdminItemModal from "@/components/admin/item/AdminItemModal";
import ItemCreateButton from "@/components/admin/item/button/ItemCreateButton";
import {fetchItemsApi} from "@/lib/api/admin/item/item.query";

export default function AdminItemPage() {
    const [items, setItems] = useState<Item[]>([]);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { accessToken, refreshAccessToken } = useAdminAuth();

    const loadItems = async () => {
        if (!accessToken) {
            console.error("Access token is missing. The operation failed.");
            return;
        }

        try {
            const fetched = await fetchItemsApi(accessToken, refreshAccessToken);
            setItems(fetched);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        loadItems();
    }, []);

    const handleItemClick = (item: Item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    const handleItemCreate = () => {
        setSelectedItem(null);
        setIsModalOpen(true);
    };

    const handleItemModalClose = () => {
        setIsModalOpen(false);
        setSelectedItem(null);
    };

    return (
        <>
            <div className="flex justify-end mr-4 mb-5">
                <ItemCreateButton onCreate={handleItemCreate} />
            </div>

            <div className="flex-1 overflow-y-auto">
                <div className="grid gap-1.5 grid-cols-4">
                    {items.map((item) => {
                        const thumbnailSrc = item.imageUrls?.[item.thumbnailIndex ?? 0] ?? "/placeholder.png";

                        return (
                            <div key={item.itemId} className="flex flex-col items-center">
                                <div
                                    onClick={() => handleItemClick(item)}
                                    className="w-full aspect-square rounded-xl overflow-hidden flex items-center justify-center cursor-pointer hover:opacity-80 transition"
                                >
                                    <img
                                        src={thumbnailSrc}
                                        alt={item.title}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <AnimatePresence>
                {isModalOpen && (
                    <AdminItemModal
                        item={selectedItem}
                        onClose={handleItemModalClose}
                        onDataChange={loadItems}
                    />
                )}
            </AnimatePresence>
        </>
    );
}