"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect } from "react";

function ErrorHandler() {
    const router = useRouter();
    const searchParams = useSearchParams();

    useEffect(() => {
        const errorMessages: { [key: string]: string } = {

            failed_login_sync: "로그인 처리에 실패했습니다.",

            default: "알 수 없는 오류가 발생했습니다."
        };

        const code = searchParams.get('code') || 'default';
        const message = errorMessages[code] || errorMessages.default;
        alert(`${message} [${code}]`);

        router.replace('/');

    }, [searchParams, router]);

    return null;
}

export default function ErrorPage() {
    return (
        <Suspense fallback={null}>
            <ErrorHandler />
        </Suspense>
    );
}