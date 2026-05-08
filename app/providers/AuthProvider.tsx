"use client";

import React, { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { fetchGuestSid } from "@/lib/api/auth/auth.command";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const { sid, setSid, _hasHydrated } = useAuthStore();

    useEffect(() => {
        if (!_hasHydrated) return;

        const initGuestSession = async () => {
            if (sid) return;

            try {
                const newSid = await fetchGuestSid();
                setSid(newSid);
            } catch (error) {
                console.error(error);
            }
        };

        initGuestSession();
    }, [_hasHydrated]);

    return <>{children}</>;
}