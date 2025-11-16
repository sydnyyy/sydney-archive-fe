"use client";

import { useState, useEffect, useRef } from "react";
import { productItems } from "@/lib/items/productItems";
import { restaurantItems } from "@/lib/items/restaurantItems";
import { recipeItems } from "@/lib/items/RecipeItems";
import { Item } from "@/lib/types";
import { TAB_VALUES, TabValue } from "@/constants/tab/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { isProductItem, isRestaurantItem, isRecipeItem } from "@/lib/types";
import { CLIENT_ID_KEY } from "@/constants/auth/storageKeys";

import ActionTabs from "@/components/common/ActionTabs";
import ProductModal from "@/components/product/ProductModal";
import RecipeModal from "@/components/food/RecipeModal";
import RestaurantModal from "@/components/food/RestaurantModal";
import UserChatView, { UserChatViewRef } from "@/components/chat/user/UserChatView";
import Footer from "@/components/common/Footer";

export default function Page() {
    const [activeTab, setActiveTab] = useState<TabValue>(TAB_VALUES.PRODUCT);
    const [showSidebarText, setShowSidebarText] = useState(false);
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);

    const chatRef = useRef<UserChatViewRef>(null);
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [currentChatItem, setCurrentChatItem] = useState<Item | null>(null);
    const [nextChatItem, setNextChatItem] = useState<Item | null>(null);

    const [clientId, setClientId] = useState<string>("anonymous");

    useEffect(() => {
        const clientId = localStorage.getItem(CLIENT_ID_KEY) ?? "anonymous";
        setClientId(clientId);
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

    const handleChatTabClick = () => {
        if (!isChatOpen) {
            setIsChatOpen(true);
            setTimeout(() => {
                chatRef.current?.startItemChat?.();
            }, 0);
        } else {
            chatRef.current?.handleChatToggle?.();
        }
    };

    let filteredItems: Item[] = [];
    if (activeTab === TAB_VALUES.PRODUCT) {
        filteredItems = [...productItems, ...restaurantItems, ...recipeItems];
    } else if (activeTab === TAB_VALUES.STUDY) {
        // TODO: 스터디 아이템 추가
    }

    // 스크롤 감지 (사이드 문구)
    useEffect(() => {
        const handleScroll = () => {
            setShowSidebarText(window.scrollY > 150);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
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

                    {selectedItem && isProductItem(selectedItem) && (
                        <ProductModal
                            item={selectedItem}
                            onClose={() => setSelectedItem(null)}
                            clientId={clientId}
                        />
                    )}

                    {selectedItem && isRecipeItem(selectedItem) && (
                        <RecipeModal
                            item={selectedItem}
                            onClose={() => setSelectedItem(null)}
                            clientId={clientId}
                        />
                    )}
                </AnimatePresence>

                <div className="w-full max-w-2xl mx-auto lg:max-w-3xl">
                    {/* 메인 문구 (스크롤되면서 사라짐) */}
                    <div className="p-6 text-gray-600 leading-relaxed text-sm text-right">
                        내 위시리스트야<br />
                        네가 경험했으면 하는 내 위시리스트<br />
                        네가 소소한 행복에도 잘 살아갔으면 좋겠어<br />
                        그것 또한 내 위시리스트야
                    </div>

                    {/* 아이템 리스트 */}
                    <div className="w-full mx-auto max-w-none p-1">
                        <div className="grid gap-1.5 grid-cols-4">
                            {filteredItems.map((item) => (
                                <div key={item.id} className="flex flex-col items-center">
                                    {isProductItem(item) || isRecipeItem(item) ? (
                                        <img
                                            src={item.image}
                                            alt={item.title}
                                            className="rounded-xl shadow-md cursor-pointer"
                                            onClick={() => handleItemClick(item)}
                                        />
                                    ) : isRestaurantItem(item) ? (
                                        <RestaurantModal
                                            item={item}
                                            onSelect={handleItemClick}
                                            clientId={clientId}
                                        />
                                    ) : null}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </main>

            <ActionTabs
                activeTab={activeTab}
                setActiveTab={setActiveTab}
                onWishlistClick={() => console.log("wishlist clicked")}  // TODO: 위시리스트 기능 연결
                onProfileClick={() => console.log("profile clicked")}    // TODO: 프로필 기능 연결
                onChatClick={handleChatTabClick}
                isChatOpen={isChatOpen}
            />

            {isChatOpen && (
                <UserChatView
                    ref={chatRef}
                    onOptionSelect={handleChatOptionSelect}
                    isChatOpen={isChatOpen}
                    setIsChatOpen={setIsChatOpen}
                    clientId={clientId}
                />
            )}

            <Footer />
        </div>
    );
}