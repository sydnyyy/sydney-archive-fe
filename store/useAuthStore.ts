import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { fetchUid } from "@/lib/api/user/auth/auth.command";

interface AuthState {
    uid: string | null;
    setUid: (uid: string) => void;
    refreshUid: () => void;
    clearUid: () => void;
    _hasHydrated: boolean;
    setHasHydrated: (state: boolean) => void;
}

export const UID_KEY = "uid";

export const useAuthStore = create<AuthState>() (
    persist(
        (set, get) => ({
            uid: null,
            setUid: (uid) => set({ uid: uid }),
            refreshUid: async () => {
                try {
                    set({ uid: await fetchUid(get().uid) })
                } catch (error) {
                    console.log(error);
                }
            },
            clearUid: () => set({ uid: null }),
            _hasHydrated: false,
            setHasHydrated: (state) => set({ _hasHydrated: state }),
        }),
        {
            name: UID_KEY,
            partialize: (state) => ({
                sid: state.uid
            }),
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            }
        }
    )
);