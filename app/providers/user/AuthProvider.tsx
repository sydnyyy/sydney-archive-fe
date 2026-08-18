"use client";

import React, {createContext, useCallback, useContext, useEffect, useState} from "react";
import {User} from "@/types/domain/user/user";
import {fetchCurrentGuestApi} from "@/lib/api/user/auth/auth.query";
import {fetchGuestToken} from "@/lib/api/user/auth/auth.command";

interface AuthContextValue {
    loading: boolean;
    user: User | null;
    accessToken: string | null;
    refreshAccessToken: () => Promise<string>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        refreshAccessToken();
    }, []);

    const refreshAccessToken = useCallback(async() => {
        try {
            setLoading(true);
            const newAccessToken = await fetchGuestToken();
            setAccessToken(newAccessToken);

            setUser(await fetchCurrentGuestApi(newAccessToken));

            return newAccessToken;
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            setLoading(false);
        }
    }, []);

    return (
        <AuthContext.Provider
            value={{
                loading,
                user,
                accessToken,
                refreshAccessToken
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useUserAuth() {
    const ctx = useContext(AuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used inside AuthProvider");
    }
    return ctx;
}