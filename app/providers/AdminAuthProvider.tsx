"use client";

import React, {createContext, useCallback, useContext, useEffect, useState} from "react";
import { Admin } from "@/types/domain/user/user";
import { issueAccessTokenApi, logoutApi } from "@/lib/api/auth/admin.auth.command";
import { fetchCurrentAdminApi } from "@/lib/api/user/admin.query";

interface AdminAuthContextValue {
    admin: Admin | null;
    loading: boolean;
    accessToken: string | null;
    loginSync: (sid: string) => Promise<void>;
    logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export default function AdminAuthProvider({ children }: { children: React.ReactNode }) {

    const [admin, setAdmin] = useState<Admin | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loginSync();
    }, []);

    const clearAuth = useCallback(() => {
        setAdmin(null);
        setAccessToken(null);
    }, []);

    const loginSync = useCallback(async (sid?: string) => {
        try {
            setLoading(true);

            const newAccessToken = await issueAccessTokenApi(sid);
            setAccessToken(newAccessToken);

            const fetchedAdmin = await fetchCurrentAdminApi(newAccessToken);
            setAdmin(fetchedAdmin);

        } catch (error) {
            console.error("Auth synchronization failed: ", error);
            clearAuth();
        } finally {
            setLoading(false);
        }
    }, [clearAuth]);

    const logout = useCallback(async () => {
        try {
            await logoutApi();
        } catch (error) {
            console.warn("Server-side logout failed, clearing local state anyway.", error);
        } finally {
            clearAuth();
            window.location.href = "/";
        }
    }, [clearAuth]);

    return (
        <AdminAuthContext.Provider
            value={{
                admin,
                loading,
                accessToken,
                loginSync,
                logout
            }}
        >
            {children}
        </AdminAuthContext.Provider>
    );
}

export function useAdminAuth() {
    const ctx = useContext(AdminAuthContext);
    if (!ctx) {
        throw new Error("useAuth must be used inside GuestAuthProvider");
    }
    return ctx;
}