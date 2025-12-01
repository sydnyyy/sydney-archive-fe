"use client";

import { useState, useEffect, useRef } from "react";
import { productItems } from "@/lib/items/productItems";
import { restaurantItems } from "@/lib/items/restaurantItems";
import { recipeItems } from "@/lib/items/RecipeItems";
import { Item } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { fetchLikeListApi } from "@/lib/like/likeApi";

import BasicModal from "@/components/common/BasicModal";
import UserChatView, { UserChatViewRef } from "@/components/chat/user/UserChatView";
import { useChat } from "@/app/(home)/context/ChatContext";
import { useClient } from "@/app/(home)/context/ClientContext";

export default function ItemPage() {
    const [selectedItem, setSelectedItem] = useState<Item | null>(null);
    const [showSidebarText, setShowSidebarText] = useState(false);
    const [likedSet, setLikedSet] = useState<Set<string>>(new Set());

    const chatRef = useRef<UserChatViewRef>(null);

    const { isChatOpen, setIsChatOpen } = useChat();
    const { clientId } = useClient();

    useEffect(() => {
        async function loadLikes() {
            try {
                const likes = await fetchLikeListApi(clientId);
                setLikedSet(likes);
            } catch (err) {
                console.error(err);
            }
        }
        loadLikes();
    }, [clientId]);

    const handleItemClick = (item: Item) => {
        setSelectedItem(item);
        chatRef.current?.startItemChat(item.title);
    };

    const handleChatClick = () => {
        if (!isChatOpen) {
            setIsChatOpen(true);
        } else {
            chatRef.current?.handleChatToggle?.();
        }
    };

    const handleShare = () => {
        // TODO: 공유 기능
    };

    const filteredItems: Item[] = [...productItems, ...restaurantItems, ...recipeItems];

    // 스크롤 감지 (사이드 문구)
    useEffect(() => {
        const handleScroll = () => setShowSidebarText(window.scrollY > 150);
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className="min-h-screen flex flex-col relative">
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
                                text-sm leading-relaxed text-right"
                            style={{ color: "var(--color-text-tertiary)" }}
                        >
                            내 위시리스트야<br />
                            네가 경험했으면 하는 내 위시리스트<br />
                            네가 소소한 행복에도 잘 살아갔으면 좋겠어<br />
                            그것 또한 내 위시리스트야
                        </motion.div>
                    )}

                    {selectedItem && (
                        <BasicModal
                            item={selectedItem}
                            onClose={() => setSelectedItem(null)}
                            clientId={clientId}
                            likedSet={likedSet}
                            setLikedSet={setLikedSet}
                            onChat={handleChatClick}
                            onShare={handleShare}
                        />
                    )}
                </AnimatePresence>

                <div className="w-full max-w-[540px] mx-auto">
                    {/* 메인 문구 (스크롤되면서 사라짐) */}
                    <div className="p-6 leading-relaxed text-sm text-right">
                        내 위시리스트야<br />
                        네가 경험했으면 하는 내 위시리스트<br />
                        네가 소소한 행복에도 잘 살아갔으면 좋겠어<br />
                        그것 또한 내 위시리스트야
                    </div>

                    {/* 아이템 리스트 */}
                    <div className="w-full grid gap-1.5 grid-cols-4">
                        {filteredItems.map((item) => {
                            const thumbnailSrc = item.images?.[item.thumbnailIndex ?? 0] ?? "/placeholder.png";

                            return (
                                <div key={item.id} className="flex flex-col items-center">
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
            </main>

            {isChatOpen && (
                <UserChatView
                    ref={chatRef}
                    isChatOpen={isChatOpen}
                    setIsChatOpen={setIsChatOpen}
                    clientId={clientId}
                    selectedItem={selectedItem}
                />
            )}
        </div>
    );
}
