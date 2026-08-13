"use client";

import {useAdminLoginStore} from "@/store/useAdminLoginStore";
import {usePlatform} from "@/hooks/platform/usePlatform";
import AdminLoginModal from "@/components/admin/auth/AdminLoginModal";
import {useEffect} from "react";
import {Spinner} from "@/components/common/Spinner";

export default function AdminLoginModalContainer() {

    const { loginSession, secret, isLoading, refreshSession } = useAdminLoginStore();
    const { platform } = usePlatform();

    useEffect(() => {
        refreshSession();
    }, []);

    if (platform === undefined) return null;

    if (isLoading) {
        return (
            <div className="flex items-center justify-center">
                <Spinner />
            </div>
        );
    }

    if (loginSession === null || secret === null) return null;

    return (
        <AdminLoginModal
            loginSession={loginSession}
            secret={secret}
            platform={platform}
        />
    );
}