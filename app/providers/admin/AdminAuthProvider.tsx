"use client";

import React, {createContext, useCallback, useContext, useEffect, useState} from "react";
import {User} from "@/types/domain/user/user";
import { issueAccessTokenApi, logoutApi } from "@/lib/api/admin/auth/auth.command";
import { fetchCurrentAdminApi } from "@/lib/api/admin/auth/auth.query";
import {completeLoginSessionApi} from "@/lib/api/admin/auth/login.command";
import {useAdminLoginStore} from "@/store/useAdminLoginStore";
import {usePatternStore} from "@/store/usePatternStore";

interface AdminAuthContextValue {
    loading: boolean;
    admin: User | null;
    accessToken: string | null;
    refreshAccessToken: () => Promise<string>;
    loginSync: () => Promise<void>;
    completeLoginSessionAndLoginSync: (sid: string, version: number, secret: string) => Promise<void>;
    logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextValue | null>(null);

export default function AdminAuthProvider({ children }: { children: React.ReactNode }) {

    const [admin, setAdmin] = useState<User | null>(null);
    const [accessToken, setAccessToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    const { loginSessionId, clearSession, removeSessionSid } = useAdminLoginStore();

    useEffect(() => {
        loginSync();
    }, []);

    const clearAuth = useCallback(() => {
        setAdmin(null);
        setAccessToken(null);
    }, []);

    const refreshAccessToken = useCallback(async() => {
        try {
            setLoading(true);
            const newAccessToken = await issueAccessTokenApi();
            setAccessToken(newAccessToken);
            return newAccessToken;
        } catch (error) {
            console.error(error);
            await logout();
            throw error;
        } finally {
            setLoading(false);
        }
    }, [clearAuth]);

    const loginSync = useCallback(async() => {
        try {
            setLoading(true);

            const newAccessToken = await issueAccessTokenApi(loginSessionId);
            setAccessToken(newAccessToken);

            const fetchedAdmin = await fetchCurrentAdminApi(newAccessToken, refreshAccessToken);
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

    const completeLoginSessionAndLoginSync
        = useCallback(async(sid: string, version: number, secret: string) => {
            try {
                setLoading(true);

                await completeLoginSessionApi(sid, version, secret);

                const newAccessToken = await issueAccessTokenApi(sid);
                setAccessToken(newAccessToken);

                const fetchedAdmin = await fetchCurrentAdminApi(newAccessToken, refreshAccessToken);
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
        }
    }, [clearAuth]);

    return (
        <AdminAuthContext.Provider
            value={{
                loading,
                admin,
                accessToken,
                refreshAccessToken,
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
        throw new Error("useAuth must be used inside AdminAuthProvider");
    }
    return ctx;
}