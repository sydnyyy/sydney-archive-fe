"use client";

import {
    HomeIcon,
    BeakerIcon,
    ChatBubbleOvalLeftEllipsisIcon,
    EyeIcon,
    UserIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AdminLoginModal from "@/components/admin/auth/AdminLoginModal";
import { useAdminAuth } from "@/app/providers/admin/AdminAuthProvider";
import AdminLogoutModal from "@/components/admin/auth/AdminLogoutModal";

export default function AdminMainNavigation() {

    const router = useRouter();
    const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

    const { admin } = useAdminAuth();

    const navItems = [
        {
            icon: HomeIcon,
            action: "/admin/item"
        },
        {
            icon: BeakerIcon,
            action: "/admin/dev"
        },
        {
            icon: ChatBubbleOvalLeftEllipsisIcon,
            action: "/admin/chat"
        },
        {
            icon: EyeIcon,
            action: "/admin/dashboard"
        },
        {
            icon: UserIcon,
            action: "/admin/login"
        }
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
                    onClick={() =>
                        action === "/admin/login"
                            ? setIsAuthModalOpen(true)
                            : router.push(action)}
                >
                    <Icon className="h-6 w-6" />
                </button>
            );
        });

    return (
        <>
            {/* 웹: 좌측 */}
            <nav className="hidden md:flex fixed left-0 top-0 bottom-0 w-20 flex-col items-center pt-[45vh] z-40">
                <div className="flex flex-col items-center">
                    {renderNavButtons(false)}
                </div>
            </nav>

            {/* 모바일: 하단 */}
            <nav className="fixed bottom-0 left-0 right-0 z-40 h-14 flex md:hidden">
                {renderNavButtons(true)}
            </nav>

            {isAuthModalOpen && (
                (!admin) ? (
                    <AdminLoginModal />
                    ) : (
                    <AdminLogoutModal
                        onClose={() => {
                            setIsAuthModalOpen(false);
                        }}
                    />
                )
            )}
        </>
    );
}
