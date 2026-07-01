"use client";

import "../globals.css";
import { fontVariables } from "../_shared/fonts";
import AdminMainNavigation from "@/components/admin/navigation/AdminMainNavigation";
import AdminAuthProvider, {useAdminAuth} from "@/app/providers/AdminAuthProvider";
import {usePathname, useRouter} from "next/navigation";
import {useEffect, useState} from "react";
import AdminLoginModal from "@/components/admin/auth/AdminLoginModal";
import {Spinner} from "@/components/common/Spinner";
import WebSockerProvider from "@/app/providers/AdminWebSocketProvider";

export const dynamic = "force-dynamic";

function AdminAuthGuard({ children }: { children: React.ReactNode }) {

    const router = useRouter();
    const pathname = usePathname();
    const { admin, loading } = useAdminAuth();

    useEffect(() => {
        if (loading) return;
        if (!admin) return;

        if (pathname === "/admin") {
            router.replace("/admin/item");
        }
    }, [admin, loading, pathname, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spinner />
            </div>
        );
    }

    if (!admin) {
        return (
            <AdminLoginModal />
        );
    }

    return <>{children}</>;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className={`${fontVariables} antialiased`}>
            <AdminAuthProvider>
                <WebSockerProvider>
                    <AdminAuthGuard>
                        {children}
                        <AdminMainNavigation />
                    </AdminAuthGuard>
                </WebSockerProvider>
            </AdminAuthProvider>
        </div>
    );
}