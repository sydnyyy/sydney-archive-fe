"use client";

import {Suspense, useEffect} from "react";
import {useRouter, useSearchParams} from "next/navigation";
import {Spinner} from "@/components/common/Spinner";

function OAuthSuccessContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const platform = searchParams.get('platform');

    useEffect(() => {
        if (platform !== "web") {
            window.close();
            return;
        }

        router.replace("/admin");
    }, [platform, router]);

    return (
        <div className="flex items-center justify-center min-h-screen">
            <Spinner />
        </div>
    );
}

export default function OAuthSuccessPage() {
    return (
        <Suspense>
            <OAuthSuccessContent />
        </Suspense>
    );
}