"use client";

import React, { useEffect } from "react";
import { useGuestAuthStore } from "@/store/useGuestAuthStore";
import { fetchGuestSid } from "@/lib/api/auth/guest.auth.command";

export default function GuestAuthProvider({ children }: { children: React.ReactNode }) {
    const { sid, setSid, _hasHydrated } = useGuestAuthStore();

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