"use client";

import {Client} from "@stomp/stompjs";
import {ChatMessage} from "@/types/domain/chat/chat";
import React, {createContext, useCallback, useContext, useEffect, useRef, useState} from "react";
import {useAuthStore} from "@/store/useAuthStore";
import {createStompClient} from "@/lib/api/admin/chat/socketClient";

interface WebSocketContextValue {
    stompClient: Client | null;
    chatMessage: ChatMessage | null;
}

const WebSocketContext = createContext<WebSocketContextValue | null>(null);

export default function WebSockerProvider({ children }: { children: React.ReactNode}) {

    const { uid } = useAuthStore();

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
        if (!uid) {
            disconnect();
            return;
        }

        if (stompClientRef.current?.active) {
            return;
        }

        const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
        const client = createStompClient({
            url: `${API_BASE_URL}/ws?sid=${uid}`,
            role: "user",
            subscribePaths: [
                {
                    path: "/user/queue/chat.messages",
                    onMessage: (message) => {
                        setChatMessage(message);
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

    }, [uid, disconnect]);

    return (
        <WebSocketContext.Provider
            value={{
                stompClient,
                chatMessage,
            }}
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