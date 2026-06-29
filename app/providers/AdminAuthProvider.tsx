"use client";

import React, {createContext, useCallback, useContext, useEffect, useState} from "react";
import { Admin } from "@/types/domain/user/user";
import { issueAccessTokenApi, logoutApi } from "@/lib/api/auth/admin.auth.command";
import { fetchCurrentAdminApi } from "@/lib/api/user/admin.query";
import {completeLoginSessionApi} from "@/lib/api/auth/admin.login.command";
import {useAdminLoginStore} from "@/hooks/auth/useAdminLoginStore";

interface AdminAuthContextValue {
    admin: Admin | null;
    loading: boolean;
    accessToken: string | null;
    loginSync: () => Promise<void>;
    completeLoginSessionAndLoginSync: (sid: string, version: number) => Promise<void>;
    logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export default function AdminAuthProvider({ children }: { children: React.ReactNode }) {

    const [admin, setAdmin] = useState<Admin | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const { alsid, clearSession, removeSessionSid } = useAdminLoginStore();

    useEffect(() => {
        loginSync();
    }, []);

    const clearAuth = useCallback(() => {
        setAdmin(null);
        setAccessToken(null);
    }, []);

    const loginSync = useCallback(async() => {
        try {
            setLoading(true);

            const newAccessToken = await issueAccessTokenApi(alsid);
            setAccessToken(newAccessToken);

            const fetchedAdmin = await fetchCurrentAdminApi(newAccessToken);
            setAdmin(fetchedAdmin);

            if (fetchedAdmin) {
                removeSessionSid();
            }

        } catch (error) {
            console.error("Auth synchronization failed: ", error);
            clearAuth();
            clearSession();
        } finally {
            setLoading(false);
        }
    }, [clearAuth]);

    const completeLoginSessionAndLoginSync = useCallback(async(sid: string, version: number) => {
        try {
            setLoading(true);

            await completeLoginSessionApi(sid, version);

            const newAccessToken = await issueAccessTokenApi(sid);
            setAccessToken(newAccessToken);

            const fetchedAdmin = await fetchCurrentAdminApi(newAccessToken);
            setAdmin(fetchedAdmin);

            if (fetchedAdmin) {
                removeSessionSid();
            }


        } catch (error) {
            console.error("Auth synchronization failed: ", error);
            clearAuth();
            clearSession();
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
                completeLoginSessionAndLoginSync,
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