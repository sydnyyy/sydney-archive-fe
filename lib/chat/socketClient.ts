import { Client } from "@stomp/stompjs";

export interface SubscribePath {
    path: string;
    onMessage: (msg: any) => void;
}

export interface CreateStompClientOptions {
    url: string;
    role: "admin" | "user";
    subscribePaths: SubscribePath[];
    reconnectDelay?: number;
    fetchInitialSystemMessage?: () => Promise<void>;
}

export function createStompClient(options: CreateStompClientOptions): Client {
    const client = new Client({
        brokerURL: options.url,
        reconnectDelay: options.reconnectDelay ?? 5000,
        debug: (str) => {
            console.log("STOMP DEBUG:", str);
        },
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

            if (options.fetchInitialSystemMessage) {
                try {
                    options.fetchInitialSystemMessage();
                } catch (err) {
                    console.error("❗ 초기 시스템 메시지 요청 실패:", err);
                }
            }
        },
        onWebSocketError: (err) => {
            console.error("🔴 WebSocket error:", err);
        },
        onWebSocketClose: (evt) => {
            console.warn("🟢 WebSocket closed:", evt);
        },
        onStompError: (frame) => {
            console.error(
                options.role === "admin"
                    ? `🔴 Admin STOMP 오류: ${frame.body}`
                    : `🔴 User STOMP 오류: ${frame.body}`
            );
        },
    });

    client.activate();
    return client;
}
