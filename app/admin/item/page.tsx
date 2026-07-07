"use client";

import { AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { Item } from "@/types/domain/item/item";
import { fetchItemsApi } from "@/lib/api/item/item.query";
import { useAdminAuth } from "@/app/providers/admin/AdminAuthProvider";
import AdminItemModal from "@/components/admin/item/AdminItemModal";
import ItemCreateButton from "@/components/admin/item/button/ItemCreateButton";
import Header from "@/components/layout/Header";

export default function AdminItemPage() {
    const [items, setItems] = useState<Item[]>([]);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const { accessToken } = useAdminAuth();

    const loadItems = async () => {
        try {
            const fetched = await fetchItemsApi(accessToken);
            setItems(fetched);
        } catch (err) {
            console.error("아이템 목록 갱신 실패: ", err);
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
        <div className="h-screen overflow-hidden">
            <main className="h-full">
                <div className="w-full max-w-[540px] h-full mx-auto flex flex-col p-3">

                    <div className="mt-5 mr-4 mb-5">
                        <Header />
                    </div>

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
                </div>
            </main>

            <AnimatePresence>
                {isModalOpen && (
                    <AdminItemModal
                        item={selectedItem}
                        onClose={handleItemModalClose}
                        onDataChange={loadItems}
                    />
                )}
            </AnimatePresence>
        </div>
    );
}