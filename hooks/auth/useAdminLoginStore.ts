import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {LoginSession} from "@/types/domain/auth/Auth";
import {fetchLoginSessionApi} from "@/lib/api/auth/admin.login.command";

interface LoginState {
    loginSession: LoginSession | null;
    alsid: string | null;
    isLoading: boolean;
    _hasHydrated: boolean;

    refreshSession: () => Promise<void>;
    clearSession: () => void;
    removeSessionSid: () => void;
    setHasHydrated: (state: boolean) => void;
}

const ADMIN_LOGIN_SESSION_SID_STORAGE_KEY = "ALSID";

export const useAdminLoginStore = create<LoginState>() (
    persist(
        (set, get) => ({
            loginSession: null,
            alsid: null,
            isLoading: false,
            _hasHydrated: false,

            setHasHydrated: (state) => set({ _hasHydrated: state }),

            refreshSession: async () => {
                set({ isLoading: true });

                try {
                    const newLoginSession = await fetchLoginSessionApi(get().alsid);
                    set({
                        loginSession: newLoginSession,
                        alsid: newLoginSession.sid
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
                alsid: state.alsid,
            }),
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            },
        }
    )
)