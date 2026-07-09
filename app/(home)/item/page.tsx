"use client";

import { useState, useEffect } from "react";

import ItemModal from "@/components/guest/item/ItemModal";
import { fetchItemsApi } from "@/lib/api/item/item.query";
import { Item } from "@/types/domain/item/item";

export default function ItemPage() {
    const [items, setItems] = useState<Item[]>([]);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [likedSet, setLikedSet] = useState<Set<string>>(new Set());

    useEffect(() => {
        async function loadItems() {
            try {
                const fetched = await fetchItemsApi();
                setItems(fetched);
            } catch (err) {
                console.error(err);
            }
        }

        loadItems();
    }, []);

    const handleItemClick = (item: Item) => {
        setSelectedItem(item);
    };

    const handleShare = () => {
        // TODO: 공유 기능
    };

    return (
        <>
            <div className="flex-1 overflow-y-auto">
                <div className="grid grid-cols-4 gap-1.5">
                    {items.map((item) => {
                        const thumbnailSrc = item.imageUrls?.[item.thumbnailIndex ?? 0] ?? "/placeholder.png";

                        return (
                            <div key={item.itemId} className="flex flex-col items-center">
                                <div
                                    onClick={() => handleItemClick(item)}
                                    className="w-full aspect-square rounded-xl overflow-hidden flex items-center justify-center"
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

            {selectedItem && (
                <ItemModal
                    item={selectedItem}
                    onClose={() => setSelectedItem(null)}
                    likedSet={likedSet}
                    setLikedSet={setLikedSet}
                    onShare={handleShare}
                />
            )}
        </>
    );
}
