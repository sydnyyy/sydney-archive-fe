"use client";

import ModalLayout from "@/components/common/ModalLayout";
import OAuth2ProviderButton from "@/components/admin/auth/OAuth2ProviderButton";
import {useAdminLoginStore} from "@/hooks/auth/useAdminLoginStore";
import {usePlatform} from "@/hooks/platform/usePlatform";
import {useEffect} from "react";
import {Spinner} from "@/components/common/Spinner";
import {useSse} from "@/hooks/sse/useSse";

export default function AdminLoginModal() {

    const { loginSession, isLoading, refreshSession, _hasHydrated } = useAdminLoginStore();
    const { platform } = usePlatform();

    useSse(loginSession?.sid);

    useEffect(() => {
        if (!platform) return;
        if (!_hasHydrated) return;

        refreshSession();
    }, [platform, _hasHydrated]);

    if (platform === undefined) return null;

    const showQrCode = !isLoading && (platform === "web") && loginSession;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <ModalLayout
                widthClass="w-[350px]"
                scrollable={false}
            >
                <div className="flex flex-col gap-5 p-6">
                    <div className="text-center">
                        <h2 className="text-lg font-bold">관리자 로그인</h2>
                    </div>

                    <div className="flex-1 flex flex-col justify-center items-center">
                        {isLoading ? (
                            <div className="flex items-center justify-center">
                                <Spinner />
                            </div>
                        ) : loginSession ? (
                            <div className="w-full flex flex-col gap-5">
                                {showQrCode && (
                                    <div className="flex flex-col items-center justify-between gap-2 p-3 border rounded-xl border-[var(--color-border-primary)]">
                                        <img
                                            src={`data:image/png;base64,${loginSession.qrCodeBase64}`}
                                            alt="QR Code"
                                            className="w-[150px] h-[150px] block"
                                        />
                                    </div>
                                )}

                                {showQrCode && (
                                    <div className="relative">
                                        <div className="absolute inset-0 flex items-center">
                                            <span className="w-full border-t border-[var(--color-border-primary)]"></span>
                                        </div>
                                        <div className="relative flex justify-center text-sm uppercase">
                                            <span className="bg-[var(--color-bg-modal)] px-2 text-[var(--color-text-primary)] font-medium">또는 소셜 로그인</span>
                                        </div>
                                    </div>
                                )}

                                {loginSession && (
                                    <OAuth2ProviderButton
                                        provider="naver"
                                        sid={loginSession?.sid}
                                        platform={platform}
                                        imageSrc="/icons/NAVER_login_Dark_KR_green_narrow_H48.png"
                                        alt="네이버 로그인"
                                    />
                                )}
                            </div>
                        ) : ( <div>이용할 수 없습니다.</div> )}
                    </div>
                </div>
            </ModalLayout>
        </div>
    );
}