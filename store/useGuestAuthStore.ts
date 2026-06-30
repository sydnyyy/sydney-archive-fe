import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AuthState {
    sid: string | null;
    setSid: (sid: string) => void;
    clearSid: () => void;
    _hasHydrated: boolean;
    setHasHydrated: (state: boolean) => void;
}

export const GUEST_SID_KEY = "sid";

export const useGuestAuthStore = create<AuthState>() (
    persist(
        (set) => ({
            sid: null,
            setSid: (sid) => set({ sid: sid }),
            clearSid: () => set({ sid: null }),
            _hasHydrated: false,
            setHasHydrated: (state) => set({ _hasHydrated: state }),
        }),
        {
            name: GUEST_SID_KEY,
            partialize: (state) => ({
                sid: state.sid
            }),
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated(true);
            }
        }
    )
);