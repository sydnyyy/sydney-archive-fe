import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { GUEST_SID_KEY } from "@/constants/auth/storageKeys";

interface AuthState {
    sid: string | null;
    setSid: (sid: string) => void;
    clearSid: () => void;
}

export const useAuthStore = create<AuthState>() (
    persist(
        (set) => ({
            sid: null,
            setSid: (sid) => set({ sid }),
            clearSid: () => set({ sid: null }),
        }),
        {
            name: GUEST_SID_KEY
        }
    )
);