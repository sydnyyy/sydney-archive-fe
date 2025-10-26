"use client";

import { useState, useEffect, useRef } from "react";
import { productItems } from "@/lib/productItems";
import { foodItems } from "@/lib/foodItems";
import { Item } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { ITEM_TYPE, FOOD_FORMAT } from "@/lib/types";

import CategoryTabs from "@/components/common/CategoryTabs";
import ProductModal from "@/components/product/ProductModal";
import FoodModal from "@/components/food/FoodModal";
import RestaurantCard from "@/components/food/RestaurantCard";
import ChatWidget, { ChatWidgetRef } from "@/components/chat/ChatWidget";

const categories = [
    { label: ITEM_TYPE.PRODUCT, icon: "🎁" },
    { label: ITEM_TYPE.FOOD, icon: "🍕" },
] as const;

type CategoryLabel = typeof categories[number]["label"];

export default function Page() {
    const [activeCategory, setActiveCategory] = useState<CategoryLabel>(ITEM_TYPE.PRODUCT);
    const [showSidebarText, setShowSidebarText] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [tabRightPosition, setTabRightPosition] = useState<string>('');
    const chatRef = useRef<ChatWidgetRef>(null);

    const [currentChatItem, setCurrentChatItem] = useState<Item | null>(null);
    const [nextChatItem, setNextChatItem] = useState<Item | null>(null);
    const [clientId, setClientId] = useState<string>("anonymous");

    useEffect(() => {
        const id = localStorage.getItem("client_id") ?? "anonymous";
        setClientId(id);
    }, []);

    const handleItemClick = (item: Item) => {
        setSelectedItem(item);

        if (chatRef.current?.isOpen()) {
            if (!currentChatItem) {
                setCurrentChatItem(item);
                chatRef.current.startItemChat(item.title);
            } else if (currentChatItem.id !== item.id) {
                setNextChatItem(item);
                chatRef.current.addChatMessageWithOptions({
                    content: `${currentChatItem.title} 상담을 종료하시겠습니까?`,
                    options: [
                        { label: "예", value: "yes" },
                        { label: "아니오", value: "no" },
                    ],
                });
            }
            return;
        }

        if (item.type === ITEM_TYPE.FOOD && item.format === FOOD_FORMAT.RESTAURANT && item.link) {
            window.open(item.link, "_blank");
        }
    };

    const handleChatOptionSelect = (choice: "yes" | "no") => {
        chatRef.current?.removeLastOptionMessage?.();

        if (!currentChatItem || !nextChatItem) return;

        if (choice === "yes") {
            chatRef.current?.addSystemMessage?.(`${currentChatItem.title} 상담을 종료합니다.`);

            setTimeout(() => {
                setCurrentChatItem(nextChatItem);
                chatRef.current?.startItemChat(nextChatItem.title);
            }, 500);
        }

        // 다음 아이템 초기화
        setNextChatItem(null);
    };

    let filteredItems: Item[];
    if (activeCategory === ITEM_TYPE.PRODUCT) {
        filteredItems = productItems;
    } else if (activeCategory === ITEM_TYPE.FOOD) {
        filteredItems = foodItems
    } else {
        filteredItems = [...productItems, ...foodItems];
    }

    // 스크롤 감지 (사이드 문구)
    useEffect(() => {
        const handleScroll = () => {
            setShowSidebarText(window.scrollY > 150);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    useEffect(() => {
        const calculatePosition = () => {
            const windowWidth = window.innerWidth;
            const containerWidth = 672;

            const tabWidth = 72;
            const tabMargin = 0;

            if (windowWidth > containerWidth + tabWidth + tabMargin) {
                const rightGap = (windowWidth - containerWidth) / 2;
                const position = rightGap - tabWidth - tabMargin;
                setTabRightPosition(`${position}px`);
            } else {
                setTabRightPosition('-100px');
            }
        };

        calculatePosition();
        window.addEventListener('resize', calculatePosition);
        return () => window.removeEventListener('resize', calculatePosition);
    }, []);

    return (
        <div className="min-h-screen flex flex-col relative bg-[#C5E0C7]">
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

                    {selectedItem && selectedItem.type === ITEM_TYPE.PRODUCT && (
                        <ProductModal
                            selectedItem={selectedItem}
                            onClose={() => setSelectedItem(null)}
                            clientId={clientId}
                        />
                    )}

                    {/* 음식 모달 */}
                    {selectedItem && selectedItem.type === ITEM_TYPE.FOOD && (
                        <FoodModal
                            selectedItem={selectedItem}
                            onClose={() => setSelectedItem(null)}
                            clientId={clientId}
                        />
                    )}
                </AnimatePresence>

                <div className="w-full max-w-2xl mx-auto">
                    {/* 메인 문구 (스크롤되면서 사라짐) */}
                    <div className="p-6 text-gray-600 leading-relaxed text-sm text-right">
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
                                    {item.type === ITEM_TYPE.PRODUCT && (
                                        <div onClick={() => handleItemClick(item)}>
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="rounded-xl shadow-md cursor-pointer"
                                            />
                                        </div>
                                    )}

                                    {item.type === ITEM_TYPE.FOOD && item.format === FOOD_FORMAT.RESTAURANT && (
                                        <RestaurantCard
                                            item={item}
                                            onSelect={handleItemClick}
                                            clientId={clientId}
                                        />
                                    )}

                                    {item.type === ITEM_TYPE.FOOD && item.format === FOOD_FORMAT.RECIPE && (
                                        <div onClick={() => handleItemClick(item)}>
                                            <img
                                                src={item.image}
                                                alt={item.title}
                                                className="rounded-xl shadow-md cursor-pointer"
                                            />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            {/* 탭 메뉴 (스크롤해도 고정) */}
            <div
                className={`fixed top-52 hidden lg:block`}
                style={{ right: tabRightPosition }}
            >
                <CategoryTabs
                    categories={categories}
                    activeCategory={activeCategory}
                    setActiveCategory={setActiveCategory}
                />
            </div>

            {/* 관리자 문의하기 위젯 */}
            <ChatWidget ref={chatRef} onOptionSelect={handleChatOptionSelect} />
        </div>
    );
}