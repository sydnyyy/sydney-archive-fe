"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function AdminPage() {

    const router = useRouter();

    useEffect(() => {
        router.replace("/admin/item");
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center">
            <p className="text-lg">
                이동 중... 잠시만 기다려주세요.
            </p>
        </div>
    );
}
