"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function HomePage() {
    const router = useRouter();

    useEffect(() => {
        router.replace("/item");
    }, [router]);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#C5E0C7]">
            <p className="text-gray-600 text-lg">
                이동 중... 잠시만 기다려주세요.
            </p>
        </div>
    );
}
