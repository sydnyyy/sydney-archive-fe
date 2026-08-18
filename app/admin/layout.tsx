"use client";

import "../globals.css";
import { fontVariables } from "../_shared/fonts";
import AdminMainNavigation from "@/components/admin/navigation/AdminMainNavigation";
import AdminAuthProvider, {useAdminAuth} from "@/app/providers/admin/AdminAuthProvider";
import {usePathname, useRouter} from "next/navigation";
import {useEffect} from "react";
import {Spinner} from "@/components/common/Spinner";
import AdminWebSocketProvider from "@/app/providers/admin/AdminWebSocketProvider";
import Header from "@/components/layout/Header";
import AdminLoginModalContainer from "@/components/admin/auth/AdminLoginModalContainer";

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
            <AdminLoginModalContainer />
        );
    }

    return <>{children}</>;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className={`${fontVariables} antialiased`}>
            <AdminAuthProvider>
                <AdminWebSocketProvider>
                    <AdminAuthGuard>
                        <div className="h-screen overflow-hidden">
                            <main className="h-full">
                                <div className="w-full max-w-[540px] h-full mx-auto flex flex-col p-3">
                                    <div className="mt-5 mr-4 mb-5">
                                        <Header />
                                    </div>
                                    {children}
                                </div>
                            </main>
                            <AdminMainNavigation />
                        </div>
                    </AdminAuthGuard>
                </AdminWebSocketProvider>
            </AdminAuthProvider>
        </div>
    );
}