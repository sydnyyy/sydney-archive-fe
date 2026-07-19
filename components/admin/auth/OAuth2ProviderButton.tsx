"use client";

import Image from "next/image";
import {Platform} from "@/hooks/platform/usePlatform";
import {fetchLoginSessionAvailabilityApi} from "@/lib/api/admin/auth/login.command";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

const APP_DEEP_LINK: Record<string, string> = {
    naver: "naversearchapp://inappbrowser?url=",
    kakao: "kakaotalk://inappbrowser?url=",
};

interface OAuth2ProviderButtonProps {
    provider: string;
    sid: string;
    platform: Platform;
    imageSrc: string;
    alt: string;
}

export default function OAuth2ProviderButton({
                                                 provider,
                                                 sid,
                                                 platform,
                                                 imageSrc,
                                                 alt,
                                             }: OAuth2ProviderButtonProps) {

    const handleLogin = async () => {
        try {
            const startUrl = `${API_BASE_URL}/oauth2/authorization/${provider}?sid=${sid}&platform=${platform}`;

            const available = await fetchLoginSessionAvailabilityApi(sid);

            if (!available) {
                alert("인증 세션이 유효하지 않습니다. 다시 시도해주세요.");
                return;
            }

            if (platform === 'web') {
                window.location.href = startUrl;
                return;
            }

            const deepLinkPrefix = APP_DEEP_LINK[provider];
            if (deepLinkPrefix) {
                window.location.href = `${deepLinkPrefix}${encodeURIComponent(startUrl)}`;
                return;
            }
            window.location.href = startUrl;
        } catch (error: any) {
            const code = error.code ?? "UNKNOWN";
            const message = error.message ?? "QR 인증 상태 확인 중 오류가 발생했습니다.";

            alert(`${message} [${code}]`);
        }
    };

    return (
        <button
            onClick={handleLogin}
            className="flex justify-center"
        >
            <Image
                src={imageSrc}
                alt={alt}
                width={230}
                height={48}
                priority
            />
        </button>
    );
}