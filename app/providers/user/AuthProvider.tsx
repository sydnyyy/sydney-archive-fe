"use client";

import React, { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const { refreshSid, _hasHydrated } = useAuthStore();

    useEffect(() => {
        if (!_hasHydrated) return;
        refreshSid();
    }, [_hasHydrated]);

    return <>{children}</>;
}