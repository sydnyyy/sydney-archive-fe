"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { CLIENT_ID_KEY } from "@/constants/auth/storageKeys";

interface ClientContextType {
    clientId: string;
    setClientId: (id: string) => void;
}

const ClientContext = createContext<ClientContextType | undefined>(undefined);

export function ClientProvider({ children }: { children: ReactNode }) {
    const [clientId, setClientId] = useState("anonymous");

    useEffect(() => {
        const cid = localStorage.getItem(CLIENT_ID_KEY) ?? "anonymous";
        setClientId(cid);
    }, []);

    return (
        <ClientContext.Provider value={{ clientId, setClientId }}>
            {children}
        </ClientContext.Provider>
    );
}

export function useClient() {
    const context = useContext(ClientContext);
    if (!context) throw new Error("useClient must be used within ClientProvider");
    return context;
}
