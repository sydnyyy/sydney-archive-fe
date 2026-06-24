import { create } from 'zustand';
import {LoginSession} from "@/types/domain/auth/Auth";
import {fetchLoginSessionApi} from "@/lib/api/auth/admin.login.command";

interface LoginState {
    loginSession: LoginSession | null;
    isLoading: boolean;
    refreshSession: (force?: boolean) => Promise<void>;
    clearSession: () => void;
}

export const useAdminLoginStore = create<LoginState>((set, get) => ({
    loginSession: null,
    isLoading: false,

    refreshSession: async (force = false) => {
        const { loginSession } = get();

        if (!force && loginSession) {
            const BUFFER_TIME = 10 * 1000;
            const isExpired = Date.now() >= (loginSession.expiredAt - BUFFER_TIME);
            if (!isExpired) return;
        }

        const previousSid = loginSession?.sid;

        set({ isLoading: true });
        try {
            const newLoginSession = await fetchLoginSessionApi(previousSid);
            set({ loginSession: newLoginSession });
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
}));