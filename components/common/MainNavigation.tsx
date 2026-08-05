"use client";

import {
    HomeIcon,
    BeakerIcon,
    HeartIcon,
    ChatBubbleOvalLeftEllipsisIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import ChatModal from "@/components/chat/ChatModal";
import { useAuthStore } from "@/store/useAuthStore";
import {useState} from "react";
import WebSockerProvider from "@/app/providers/user/WebSocketProvider";

export default function MainNavigation() {

    const router = useRouter();

    const [isChatOpen, setIsChatOpen] = useState(false);
    const { uid } = useAuthStore();

    const navItems = [
        {
            icon: HomeIcon,
            action: "/"
        },
        {
            icon: BeakerIcon,
            action: "/dev"
        },
        {
            icon: HeartIcon,
            action: "/likes"
        },
        {
            icon: ChatBubbleOvalLeftEllipsisIcon,
            action: "/chat"
        },
    ];

    const renderNavButtons = (isMobile = false) =>
        navItems.map((item, i) => {
            const Icon = item.icon;
            const action = item.action;

            return (
                <button
                    key={i}
                    className={`flex flex-col items-center justify-center ${
                        isMobile ? "flex-11" : "w-full h-16"
                    }`}
                    onClick={() => action !== "/chat" ? router.push(action) : setIsChatOpen(!isChatOpen)}
                >
                    <Icon className="h-6 w-6" />
                </button>
            );
        });

    return (
        <>
            {/* 웹: 좌측 */}
            <nav className="hidden md:flex fixed left-0 top-0 bottom-0 w-20 flex-col items-center pt-[52vh] z-40">
                <div className="flex flex-col items-center">
                    {renderNavButtons(false)}
                </div>
            </nav>

            {/* 모바일: 하단 */}
            <nav className="fixed bottom-0 left-0 right-0 z-40 h-14 flex md:hidden">
                {renderNavButtons(true)}
            </nav>

            {isChatOpen && uid && (
                <WebSockerProvider>
                    <ChatModal
                        setIsChatOpen={setIsChatOpen}
                    />
                </WebSockerProvider>
            )}
        </>
    );
}
