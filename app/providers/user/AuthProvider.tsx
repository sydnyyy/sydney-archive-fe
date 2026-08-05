"use client";

import React, { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const { refreshUid, _hasHydrated } = useAuthStore();

    useEffect(() => {
        if (!_hasHydrated) return;
        refreshUid();
    }, [_hasHydrated]);

    return <>{children}</>;
}