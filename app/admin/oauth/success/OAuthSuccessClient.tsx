"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";
import { useAdminAuth } from "@/app/providers/AdminAuthProvider";

function OAuthSuccessContent() {
    const router = useRouter();
    const { loginSync } = useAdminAuth();

    const searchParams = useSearchParams();
    const sid = searchParams.get("sid");

    useEffect(() => {
        const performLoginSync = async () => {
            if (!sid) {
                alert("잘못된 접근입니다.");
                return;
            }

            try {
                await loginSync(sid);
                router.replace("/admin");
            } catch (error) {
                console.error("Login synchronization failed:", error);
                router.replace("/error?code=failed_login_sync");
            }
        };

        performLoginSync();
    }, []);

    return (
        <div className="w-10 h-10 border-4 border-[var(--color-border-primary)] border-t-transparent rounded-full animate-spin"></div>
    );
}

export default function OAuthSuccessPage() {
    return (
        <Suspense fallback={null}>
            <OAuthSuccessContent />
        </Suspense>
    );
}