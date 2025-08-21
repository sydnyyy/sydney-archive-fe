"use client";

import { useState, useEffect } from "react";
import { productItems } from "@/lib/productItems";
import { foodItems } from "@/lib/foodItems";
import { Item } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import TaggedImage from "@/components/TaggedImage";

const typeIcon: Record<Item["type"], string> = {
    상품: "🛒",
    음식: "🍽️",
};

const categories = ["상품", "음식"] as const;

export default function Page() {
    const [activeCategory, setActiveCategory] = useState<(typeof categories)[number]>("상품");
    const [showSidebarText, setShowSidebarText] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);

    let filteredItems: Item[];
    if (activeCategory === "상품") {
        filteredItems = productItems;
    } else if (activeCategory === "음식") {
        filteredItems = foodItems
    } else {
        filteredItems = [...productItems, ...foodItems];
    }

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

                    {/* 음식 모달 */}
                    {selectedItem && selectedItem.type === "음식" && (
                        <motion.div
                            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
                            onClick={() => setSelectedItem(null)}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            <motion.div
                                className="bg-white p-4 rounded-2xl w-[90%] max-w-xl relative shadow-2xl flex flex-row gap-7"
                                onClick={(e) => e.stopPropagation()}
                                initial={{ scale: 0.5, opacity: 0 }}
                                animate={{ scale: 1, opacity: 1 }}
                                exit={{ scale: 0.8, opacity: 0 }}
                                transition={{ duration: 0.3, ease: "easeOut" }}
                            >

                                {/* 왼쪽: 이미지 */}
                                {selectedItem.image && (
                                    <div className="flex-shrink-0 w-60 h-60 bg-gray-100 rounded-xl overflow-hidden">
                                        <img
                                            src={selectedItem.image}
                                            alt={selectedItem.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                )}

                                {/* 오른쪽: 텍스트 */}
                                <div className="flex-1 flex flex-col justify-start text-left mt-1">
                                    <h2 className="text-xl font-bold mb-2 text-black">{selectedItem.title}</h2>

                                    {/* FoodItem의 format에 따라 다른 내용 표시 */}
                                    {"format" in selectedItem && selectedItem.format === "음식점" && (
                                        <>
                                            {"description" in selectedItem && (
                                                <p className="text-sm text-gray-700 mb-2">{selectedItem.description}</p>
                                            )}
                                            {"location" in selectedItem && (
                                                <p className="text-sm text-gray-600 mb-3">📍 {selectedItem.location}</p>
                                            )}
                                        </>
                                    )}

                                    {"format" in selectedItem && selectedItem.format === "레시피" && (
                                        <>
                                            {"cookTime" in selectedItem && (
                                                <p className="text-sm text-gray-600 mb-3">⏱️ {selectedItem.cookTime}</p>
                                            )}
                                            {"ingredients" in selectedItem && (
                                                <div className="mb-3">
                                                    <p className="text-sm font-semibold mb-1 text-black">재료</p>
                                                    <p className="text-sm text-gray-700">{selectedItem.ingredients}</p>
                                                </div>
                                            )}
                                            {"steps" in selectedItem && selectedItem.steps && (
                                                <div>
                                                    <p className="text-sm font-semibold mb-1 text-black">초간단 레시피</p>
                                                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                                                        {selectedItem.steps.map((step, idx) => (
                                                            <li key={idx}>{step}</li>
                                                        ))}
                                                    </ul>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
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
                                            text-center transition hover:scale-[1.02]"
                                    >
                                        {/* 음식점이면 카드 플립 */}
                                        {item.type === "음식" && "format" in item && item.format === "음식점" ? (
                                            <div className="
                                                relative w-full aspect-square perspective-[1000px]
                                                cursor-pointer"
                                            >
                                                <motion.div
                                                    className="
                                                        relative w-full h-full preserve-3d rounded-2xl
                                                    "
                                                    whileHover={{ rotateY: 180 }}
                                                    transition={{ duration: 0.6, ease: "easeInOut" }}
                                                >
                                                    {/* 앞면 */}
                                                    <div className="
                                                        absolute inset-0 backface-hidden rounded-2xl overflow-hidden
                                                    ">
                                                        <img
                                                            src={item.image}
                                                            alt={item.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    </div>

                                                    {/* 뒷면 */}
                                                    <a
                                                        href={item.link}
                                                        target="-_blank"
                                                        rel="noopener noreferrer"
                                                        className="
                                                        absolute inset-0 flex flex-col items-center justify-center
                                                        rounded-2xl backface-hidden rotate-y-180
                                                        bg-white border-2 border-gray-200 shadow-md p-2
                                                    ">
                                                        <h3 className="text-[15px] text-shadow-md font-semibold text-gray-700 mb-2">
                                                            {item.title}
                                                        </h3>
                                                        {item.description && (
                                                            <p className="text-[13px] font-semibold text-gray-500 mb-2">{item.description}</p>
                                                        )}
                                                        {item.location && (
                                                            <p className="text-[13px] font-semibold text-gray-500 mb-0.5">📍 {item.location}</p>
                                                        )}
                                                        <p className="text-xs text-gray-400">클릭 시 상세 페이지 이동</p>
                                                    </a>
                                                </motion.div>
                                            </div>
                                        ) : (
                                            // 나머지 (상품 + 레시피) → 기존 모달
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="w-full h-full aspect-square object-cover rounded-lg cursor-pointer"
                                                onClick={() => setSelectedItem(item)}
                                            />
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