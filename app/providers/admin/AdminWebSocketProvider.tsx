import React, {createContext, useCallback, useContext, useEffect, useRef, useState} from "react";
import {Client} from "@stomp/stompjs";
import {useAdminAuth} from "@/app/providers/admin/AdminAuthProvider";
import {createStompClient} from "@/lib/api/admin/chat/socketClient";
import {ChatMessage} from "@/types/domain/chat/chat";

interface AdminWebSocketContextValue {
    stompClient: Client | null;
    chatMessage: ChatMessage | null;
}

const AdminWebSocketContext = createContext<AdminWebSocketContextValue | null>(null);

export default function AdminWebSocketProvider({ children }: { children: React.ReactNode}) {

    const { admin } = useAdminAuth();
    const [stompClient, setStompClient] = useState<Client | null>(null);
    const stompClientRef = useRef<Client | null>(null);

    const [chatMessage, setChatMessage] = useState<ChatMessage | null>(null);

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
            url: `${API_BASE_URL}/ws?sid=${admin.userId}`,
            role: "admin",
            subscribePaths: [
                {
                    path: "/topic/admin.chat",
                    onMessage: (msg: ChatMessage) => {
                        setChatMessage(msg);
                    },
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
        <AdminWebSocketContext.Provider
            value={{
                stompClient,
                chatMessage
            }}
        >
            {children}
        </AdminWebSocketContext.Provider>
    );
}

export function useAdminWebSocket() {
    const ctx = useContext(AdminWebSocketContext);
    if (!ctx) {
        throw new Error("useAdminWebSocket must be used inside AdminWebSocketProvider");
    }
    return ctx;
}