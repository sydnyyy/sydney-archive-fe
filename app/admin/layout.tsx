"use client";

import "../globals.css";
import { fontVariables } from "../_shared/fonts";
import AdminMainNavigation from "@/components/admin/navigation/AdminMainNavigation";
import AdminAuthProvider, {useAdminAuth} from "@/app/providers/AdminAuthProvider";
import {usePathname, useRouter} from "next/navigation";
import {useEffect, useState} from "react";

export const dynamic = "force-dynamic";

function AdminAuthGuard({ children }: { children: React.ReactNode }) {

    const router = useRouter();
    const pathname = usePathname();
    const { admin, loading } = useAdminAuth();
    const [isReady, setIsReady] = useState(false);

    useEffect(() => {
        if (pathname === "/admin") {
            if (admin) {
                router.replace("/admin/item");
            } else {
                setIsReady(true);
            }
            return;
        }

        if (pathname.startsWith("/admin/oauth/")) {
            setIsReady(true);
            return;
        }

        if (!loading) {
            if (!admin) {
                router.replace("/admin");
            } else {
                setIsReady(true);
            }
        } else {
            if (admin) {
                setIsReady(true);
            }
        }
    }, [admin, loading, pathname, router]);

    if (!isReady) {
        return (
            <div className="h-screen w-screen flex items-center justify-center text-sm">
                인증 확인 중...
            </div>
        );
    }
    return <>{children}</>;
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className={`${fontVariables} antialiased`}>
            <AdminAuthProvider>
                <AdminAuthGuard>
                    {children}
                    <AdminMainNavigation />
                </AdminAuthGuard>
            </AdminAuthProvider>
        </div>
    );
}