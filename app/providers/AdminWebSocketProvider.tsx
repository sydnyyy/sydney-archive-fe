import React, {createContext, useCallback, useContext, useEffect, useRef, useState} from "react";
import {Client} from "@stomp/stompjs";
import {useAdminAuth} from "@/app/providers/AdminAuthProvider";
import {createStompClient} from "@/lib/api/chat/socketClient";

interface WebSocketContextValue {
    stompClient: Client | null;
}

const WebSocketContext = createContext<WebSocketContextValue | null>(null);

export default function WebSockerProvider({ children }: { children: React.ReactNode}) {

    const { admin } = useAdminAuth();
    const [stompClient, setStompClient] = useState<Client | null>(null);
    const stompClientRef = useRef<Client | null>(null);

    const disconnect = useCallback(async () => {
        if (stompClientRef.current) {
            await stompClientRef.current.deactivate();

            stompClientRef.current = null;
            setStompClient(null);
        }
    }, []);

    useEffect(() => {
        if (!admin) {
            disconnect();
            return;
        }

        if (stompClientRef.current?.active) {
            return;
        }

        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
        const client = createStompClient({
            url: `${API_BASE_URL}/ws?sid=${admin.sid}`,
            role: "admin",
            subscribePaths: [
                {
                    path: "/topic/admin.chat",
                },
            ],
            reconnectDelay: 5000,
        });

        stompClientRef.current = client;
        setStompClient(client);

        return () => {
            client.deactivate();

            stompClientRef.current = null;
            setStompClient(null);
        };

    }, [admin, disconnect]);

    return (
        <WebSocketContext.Provider
            value={{ stompClient }}
        >
            {children}
        </WebSocketContext.Provider>
    );
}

export function useWebSocket() {
    const ctx = useContext(WebSocketContext);

    if (!ctx) {
        throw new Error("useWebSocket must be used inside WebSocketProvider");
    }

    return ctx;
}