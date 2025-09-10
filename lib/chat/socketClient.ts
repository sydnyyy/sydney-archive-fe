import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";

export interface SubscribePath {
    path: string;
    onMessage: (msg: any) => void;
}

export interface CreateStompClientOptions {
    url: string;
    role: "admin" | "user";
    subscribePaths: SubscribePath[];
    reconnectDelay?: number;
}

export function createStompClient(options: CreateStompClientOptions): Client {
    const client = new Client({
        webSocketFactory: () => new SockJS(options.url),
        reconnectDelay: options.reconnectDelay ?? 5000,
        onConnect: () => {
            console.log(
                options.role === "admin"
                    ? "🟢 Admin STOMP 연결 성공"
                    : "🟢 User STOMP 연결 성공"
            );

            options.subscribePaths.forEach(({ path, onMessage }) => {
                client.subscribe(path, (message) => {
                    onMessage(JSON.parse(message.body));
                });
            });
        },
        onStompError: (frame) => {
            console.error(
                options.role === "admin"
                    ? `❌ Admin STOMP 오류: ${frame.body}`
                    : `❌ User STOMP 오류: ${frame.body}`
            );
        },
    });

    client.activate();
    return client;
}
