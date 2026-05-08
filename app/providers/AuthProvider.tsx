"use client";

import React, { useEffect } from "react";
import { useAuthStore } from "@/store/useAuthStore";
import { fetchGuestSid } from "@/lib/api/auth/auth.command";

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const { sid, setSid } = useAuthStore();

    useEffect(() => {
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
    }, []);

    return <>{children}</>;
}