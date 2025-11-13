"use client";

import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { TAB_VALUES, TabValue } from "@/constants/tab/tabs";

type TabType = "category" | "feature";

interface TabItem {
    icon: string;
    value: TabValue;
    type: TabType;
}

const TABS: TabItem[] = [
    { icon: "/tabs/icon-home-heart.svg", value: TAB_VALUES.PRODUCT, type: "category" },
    { icon: "/tabs/icon-book.svg", value: TAB_VALUES.STUDY, type: "category" },
    { icon: "/tabs/icon-heart.svg", value: TAB_VALUES.WISHLIST, type: "feature" },
    { icon: "/tabs/icon-user.svg", value: TAB_VALUES.PROFILE, type: "feature" },
    { icon: "/tabs/icon-comment.svg", value: TAB_VALUES.CHAT, type: "feature" },
];

interface ActionTabsProps {
    activeTab: TabValue;
    setActiveTab: Dispatch<SetStateAction<TabValue>>;
    onWishlistClick?: () => void;
    onProfileClick?: () => void;
    onChatClick?: () => void;
    isChatOpen: boolean;
}

export default function ActionTabs({
                                       activeTab,
                                       setActiveTab,
                                       onWishlistClick,
                                       onProfileClick,
                                       onChatClick,
                                       isChatOpen,
                                   }: ActionTabsProps) {

    const [tabRightPosition, setTabRightPosition] = useState("0px");

    const handleClick = (tab: TabItem) => {
        if (tab.type === "category") {
            setActiveTab(tab.value);
        } else {
            switch (tab.value) {
                case TAB_VALUES.CHAT:
                    onChatClick?.();
                    break;
                case TAB_VALUES.WISHLIST:
                    onWishlistClick?.();
                    break;
                case TAB_VALUES.PROFILE:
                    onProfileClick?.();
                    break;
            }
        }
    };

    useEffect(() => {
        const calculatePosition = () => {
            const windowWidth = window.innerWidth;
            const containerWidth = 800;
            const tabWidth = 72;
            const tabMargin = 0;

            if (windowWidth > containerWidth + tabWidth + tabMargin) {
                const rightGap = (windowWidth - containerWidth) / 2;
                const position = rightGap - tabWidth - tabMargin;
                setTabRightPosition(`${position}px`);
            } else {
                setTabRightPosition("-100px");
            }
        };

        calculatePosition();
        window.addEventListener("resize", calculatePosition);
        return () => window.removeEventListener("resize", calculatePosition);
    }, []);

    const renderButtons = () => (
        TABS.map(tab => (
            <button
                key={tab.value}
                onClick={() => handleClick(tab)}
                className={`text-3xl ${
                    tab.value === activeTab || (tab.value === TAB_VALUES.CHAT && isChatOpen) 
                        ? "opacity-100" : "opacity-20 hover:opacity-100"
                }`}
            >
                <img
                    src={tab.icon}
                    alt={tab.value}
                    className="w-8 h-8"
                />
            </button>
        ))
    );

    return (
        <div>
            {/* 웹: 오른쪽 세로 */}
            <div className="hidden lg:block fixed top-54" style={{ right: tabRightPosition }}>
                <div className="flex flex-col border-2 rounded-xl p-3.5 space-y-7">
                    {renderButtons()}
                </div>
            </div>

            {/* 모바일: 하단 가로 */}
            <div className="block lg:hidden fixed bottom-0 w-full border-t border-gray-400">
                <div className="flex justify-around pt-3 pb-5 px-4">
                    {renderButtons()}
                </div>
            </div>
        </div>
    );
}
