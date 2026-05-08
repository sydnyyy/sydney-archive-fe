import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GUEST_SID_KEY } from "@/constants/auth/storageKeys";

interface AuthState {
    sid: string | null;
    setSid: (sid: string) => void;
    clearSid: () => void;
    _hasHydrated: boolean;
    setHasHydrated: (state: boolean) => void;
}

export const useAuthStore = create<AuthState>() (
    persist(
        (set) => ({
            sid: null,
            setSid: (sid) => set({ sid }),
            clearSid: () => set({ sid: null }),
            _hasHydrated: false,
            setHasHydrated: (state) => set({ _hasHydrated: state }),
        }),
        {
            name: GUEST_SID_KEY,
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            }
        }
    )
);