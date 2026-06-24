"use client";

import {Suspense, useCallback, useEffect, useState} from "react";
import OAuth2ProviderButton from "@/components/admin/auth/OAuth2ProviderButton";
import {useRouter, useSearchParams} from "next/navigation";
import {usePlatform} from "@/hooks/platform/usePlatform";
import { fetchLoginSessionAvailabilityApi } from "@/lib/api/auth/admin.login.command";
import {Spinner} from "@/components/common/Spinner";

function QrMobileGateContent() {

    const router = useRouter();

    const searchParams = useSearchParams();
    const sid = searchParams.get('sid');

    const [loading, setLoading] = useState<boolean>(true);
    const [isSessionAvailable, setIsSessionAvailable] = useState<boolean>(false);
    const { platform } = usePlatform();

    const handleError = useCallback((message: string) => {
        alert(message);
        router.push('/');
    }, [router]);

    useEffect(() => {
        const validateEnvironmentAndSession = async () => {
            if (platform === undefined) return;
            if (platform !== 'mobile') {
                return handleError("잘못된 접근입니다. 모바일 기기에서만 이용 가능합니다.");
            }

            if (!sid) {
                return handleError("잘못된 접근입니다.");
            }

            try {
                const available = await fetchLoginSessionAvailabilityApi(sid);

                if (available) {
                    setIsSessionAvailable(true);
                } else {
                    handleError("만료된 세션입니다.");
                }
            } catch (error) {
                console.error("QR 상태 조회 에러:", error);

                if (error instanceof Error) {
                    handleError(error.message);
                } else {
                    handleError("잘못된 접근입니다.");
                }
            } finally {
                setLoading(false);
            }
        };

        validateEnvironmentAndSession();
    }, [sid, platform, handleError]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spinner />
            </div>
        );
    }

    if (!isSessionAvailable || !sid || platform !== "mobile") return null;

    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            padding: '20px',
            textAlign: 'center',
            gap: '22px'
        }}>
            <p>안전한 로그인을 위해 네이버 앱으로 이동합니다.</p>
            <OAuth2ProviderButton
                provider="naver"
                sid={sid}
                platform={platform}
                imageSrc="/icons/NAVER_login_Dark_KR_green_narrow_H48.png"
                alt="네이버 로그인"
            />
        </div>
    );
}

export default function QrMobileGatePage() {
    return (
        <Suspense>
            <QrMobileGateContent />
        </Suspense>
    );
}