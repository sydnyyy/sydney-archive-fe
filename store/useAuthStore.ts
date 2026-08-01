import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fetchGuestSid } from "@/lib/api/user/auth/auth.command";

interface AuthState {
    sid: string | null;
    setSid: (sid: string) => void;
    refreshSid: () => void;
    clearSid: () => void;
    _hasHydrated: boolean;
    setHasHydrated: (state: boolean) => void;
}

export const USER_SID_KEY = "sid";

export const useAuthStore = create<AuthState>() (
    persist(
        (set, get) => ({
            sid: null,
            setSid: (sid) => set({ sid: sid }),
            refreshSid: async () => {
                try {
                    set({ sid: await fetchGuestSid(get().sid) })
                } catch (error) {
                    console.log(error);
                }
            },
            clearSid: () => set({ sid: null }),
            _hasHydrated: false,
            setHasHydrated: (state) => set({ _hasHydrated: state }),
        }),
        {
            name: USER_SID_KEY,
            partialize: (state) => ({
                sid: state.sid
            }),
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            }
        }
    )
);