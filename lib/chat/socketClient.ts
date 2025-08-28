import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { ChatMessage } from "@/types/chat";

export function createStompClient(options: {
    url: string;
    subscribePath: string;
    role: "admin" | "user";
    onMessage: (msg: ChatMessage) => void;
    reconnectDelay?: number;
}): Client {
    const client = new Client({
        webSocketFactory: () => new SockJS(options.url),
        reconnectDelay: options.reconnectDelay ?? 5000,
        onConnect: () => {
            console.log(
                options.role === "admin"
                    ? "🟢 Admin STOMP 연결 성공"
                    : "🟢 User STOMP 연결 성공"
            );

            client.subscribe(options.subscribePath, (message) => {
                options.onMessage(JSON.parse(message.body));
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
