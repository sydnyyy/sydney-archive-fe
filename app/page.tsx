"use client";

import { useState, useEffect } from "react";
import { items } from "./lib/testitems";
import { Item } from "./lib/types";
import { motion, AnimatePresence } from "framer-motion";

const typeIcon: Record<Item["type"], string> = {
    상품: "🛒",
    음식: "🍽️",
    레시피: "🍳",
};

const categories = ["전체", "상품", "음식", "레시피"] as const;

export default function Page() {
    const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>("전체");
    const [showSidebarText, setShowSidebarText] = useState(false);

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
                            fixed top-55 left-1/2 -translate-x-[610px] mr-10 w-65
                            text-sm text-gray-700 leading-relaxed text-right"
                        >
                            내 위시리스트야<br />
                            네가 경험했으면 하는 내 위시리스트<br />
                            네가 소소한 행복에도 잘 살아갔으면 좋겠어<br />
                            그것 또한 내 위시리스트야
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="flex justify-center">
                    {/* 메인 (문구 + 아이템 리스트) */}
                    <div className="w-full max-w-4xl">

                        {/* 원래 문구 (스크롤되면서 사라짐) */}
                        <div className="p-6 text-gray-700 leading-relaxed text-sm text-right">
                            내 위시리스트야<br />
                            네가 경험했으면 하는 내 위시리스트<br />
                            네가 소소한 행복에도 잘 살아갔으면 좋겠어<br />
                            그것 또한 내 위시리스트야
                        </div>

                        {/* 아이템 리스트 */}
                        <div className="p-6">
                            <div className="grid grid-cols-2 gap-1.5 sm:grid-cols-3 lg:grid-cols-4">
                                {filteredItems.map((item) => (
                                    <div
                                        key={item.id}
                                        className="
                                        flex h-35 w-35 flex-col items-center justify-center
                                        border-2 border-gray-200
                                        rounded-4xl bg-white p-2 text-center
                                        shadow-md hover:shadow-lg hover:bg-gray-50 transition"
                                    >
                                        <div className="text-2xl">{typeIcon[item.type]}</div>
                                        <div className="mt-1 line-clamp-2 text-xs font-medium">
                                            {item.title}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 탭 메뉴 (스크롤해도 고정) */}
                    <aside className="sticky top-49 self-start flex flex-col">
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