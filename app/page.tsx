"use client";

import { useState, useEffect } from "react";
import { items } from "./lib/items";
import { Item } from "./lib/types";
import { motion, AnimatePresence } from "framer-motion";
import TaggedImage from "@/src/components/TaggedImage";

const typeIcon: Record<Item["type"], string> = {
    상품: "🛒",
    음식: "🍽️",
    레시피: "🍳",
};

const categories = ["전체", "상품", "음식", "레시피"] as const;

export default function Page() {
    const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>("전체");
    const [showSidebarText, setShowSidebarText] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);

    const filteredItems =
        activeCategory === "전체"
            ? items
            : items.filter((item) => item.type === activeCategory);

    // 스크롤 감지
    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > 150) {
                setShowSidebarText(true);
            } else {
                setShowSidebarText(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-sky-50 flex flex-col relative">
            <main className="flex flex-1 justify-center items-start p-6 relative">
                <AnimatePresence>
                    {showSidebarText && (
                        <motion.div
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: 10 }}
                            transition={{ duration: 1.7, ease: "easeOut" }}
                            className="
                            fixed top-57 left-1/2 -translate-x-[610px] mr-10 w-65
                            text-sm text-gray-400 leading-relaxed text-right"
                        >
                            내 위시리스트야<br />
                            네가 경험했으면 하는 내 위시리스트<br />
                            네가 소소한 행복에도 잘 살아갔으면 좋겠어<br />
                            그것 또한 내 위시리스트야
                        </motion.div>
                    )}

                    {selectedItem && selectedItem.type === "상품" && (
                        <motion.div
                            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                            onClick={() => setSelectedItem(null)}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div
                                className="bg-white p-3 rounded-2xl w-[90%] max-w-md relative shadow-xl"
                                onClick={(e) => e.stopPropagation()}
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                            >
                                <TaggedImage
                                    image={selectedItem.image}
                                    tags={selectedItem.tags ?? []}
                                />
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="relative w-full">
                    {/* 메인 (문구 + 아이템 리스트) */}
                    <div className="w-full max-w-2xl mx-auto">
                        {/* 메인 문구 (스크롤되면서 사라짐) */}
                        <div className="p-6 text-gray-500 leading-relaxed text-sm text-right">
                            내 위시리스트야<br />
                            네가 경험했으면 하는 내 위시리스트<br />
                            네가 소소한 행복에도 잘 살아갔으면 좋겠어<br />
                            그것 또한 내 위시리스트야
                        </div>

                        {/* 아이템 리스트 */}
                        <div className="p-6">
                            <div className="
                                grid gap-2 grid-cols-[repeat(auto-fit,minmax(0,1fr))]
                                max-[1024px]:grid-cols-3 max-[640px]:grid-cols-2 lg:grid-cols-4"
                            >
                                {filteredItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="
                                            flex flex-col items-center justify-center
                                            border-2 border-gray-200 rounded-2xl bg-white text-center
                                            shadow-md transition hover:shadow-lg hover:scale-[1.02]"
                                    >
                                        {"image" in item && item.image ? (
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="w-full h-full aspect-square object-cover rounded-lg cursor-pointer"
                                                onClick={() => setSelectedItem(item)}
                                            />
                                        ) : (
                                            <div className="text-2xl">{typeIcon[item.type]}</div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 탭 메뉴 (스크롤해도 고정) */}
                    <aside className="fixed right-107 top-52 flex flex-col space-y-1">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setActiveCategory(cat)}
                                className={`
                                w-18 whitespace-nowrap px-4 py-3 text-sm font-medium 
                                border transition-colors duration-200
                                rounded-xl
                  
                                    ${
                                    activeCategory === cat
                                        ? "bg-white text-sky-600 border-gray-300 opacity-100"
                                        : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 opacity-50"
                                }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </aside>
                </div>
            </main>
        </div>
    );
}