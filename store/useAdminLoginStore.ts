import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {LoginSession} from "@/types/domain/auth/Auth";
import {fetchLoginSessionApi} from "@/lib/api/admin/auth/login.command";
import {hashSecret} from "@/utils/secret";

interface LoginState {
    loginSession: LoginSession | null;
    loginSessionId: string | null;
    secret: string | null;
    isLoading: boolean;
    _hasHydrated: boolean;

    refreshSession: () => Promise<void>;
    clearSession: () => void;
    removeSessionSid: () => void;
    setHasHydrated: (state: boolean) => void;
}

const ADMIN_LOGIN_SESSION_SID_STORAGE_KEY = "ALSSID";

export const useAdminLoginStore = create<LoginState>() (
    persist(
        (set, get) => ({
            loginSession: null,
            loginSessionId: null,
            secret: null,
            isLoading: false,
            _hasHydrated: false,

            setHasHydrated: (state) => set({ _hasHydrated: state }),

            refreshSession: async () => {
                set({ isLoading: true });

                try {
                    const previousLoginSessionId = get().loginSessionId;

                    const bytes = new Uint8Array(32);
                    crypto.getRandomValues(bytes);

                    const secret = Array.from(bytes, byte =>
                        byte.toString(16).padStart(2, '0')
                    ).join('');

                    const secretHash = await hashSecret(secret);

                    const newLoginSession = await fetchLoginSessionApi(
                        previousLoginSessionId,
                        secretHash
                    );

                    set({
                        secret,
                        loginSession: newLoginSession,
                        loginSessionId: newLoginSession.sid
                    });
                } catch (error) {
                    console.error(error);
                } finally {
                    set({ isLoading: false })
                }
            },

            clearSession: () => {
                set({
                    loginSession: null,
                    isLoading: false,
                })
            },

            removeSessionSid: () => {
                localStorage.removeItem(ADMIN_LOGIN_SESSION_SID_STORAGE_KEY)
            }
        }),
        {
            name: ADMIN_LOGIN_SESSION_SID_STORAGE_KEY,
            partialize: (state) => ({
                sid: state.loginSessionId,
            }),
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        }
    )
)