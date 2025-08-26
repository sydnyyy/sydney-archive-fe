"use client";

import React, {
    useState,
    useEffect,
    useRef,
    forwardRef,
    useImperativeHandle,
} from "react";
import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import { v4 as uuidv4 } from "uuid";
import { CLIENT_ID_KEY } from "@/constants/auth/storageKeys";
import { ChatMessage } from "@/types/chat";
import { formatKST } from "@/utils/data";

export function getOrCreateId(
    storage: Storage,
    key: string,
    length: number = 8,
    prefix?: string
): string {
    let id = storage.getItem(key);

    if (!id) {
        const randomPart = uuidv4().replace(/-/g, "").slice(0, length);
        id = prefix ? `${prefix}_${randomPart}` : randomPart;
        storage.setItem(key, id);
    }
    return id;
}

function getBrowserName(): string {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes("chrome") && !ua.includes("edg") && !ua.includes("opr")) {
        return "chrome";
    } else if (ua.includes("safari") && !ua.includes("chrome")) {
        return "safari";
    } else if (ua.includes("firefox")) {
        return "firefox";
    } else if (ua.includes("edg")) {
        return "edge";
    }
    return "unknown";
}

export interface ChatWidgetRef {
    startItemChat: (itemName: string) => void;
    isOpen: () => boolean;
}

const ChatWidget = forwardRef<ChatWidgetRef>((props, ref) => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputMessage, setInputMessage] = useState<string>("");

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const stompClientRef = useRef<Client | null>(null);

    const [clientId, setClientId] = useState<string | null>(null);
    useEffect(() => {
        if (typeof window !== "undefined") {
            const id = getOrCreateId(localStorage, CLIENT_ID_KEY, 8, getBrowserName());
            setClientId(id);
        }
    }, []);

    // STOMP 연결 함수
    const connectStomp = (id: string) => {
        if (!id || stompClientRef.current) return;

        if (stompClientRef.current) return;

        const client = new Client({
            webSocketFactory: () =>
                new SockJS(`http://localhost:8080/ws?clientId=${id}`),
            reconnectDelay: 5000,
            onConnect: () => {
                console.log("🟢 STOMP 연결 성공");
                client.subscribe(`/user/queue/chat.messages`, (message) => {
                    const chatMessage: ChatMessage = JSON.parse(message.body);
                    if (chatMessage.sender === "wishlist-admin") {
                        setMessages((prev) => [...prev, chatMessage]);
                    }
                });
            },
            onStompError: (frame) => {
                console.error("❌ STOMP 오류: " + frame.body);
            },
        });

        client.activate();
        stompClientRef.current = client;
    };

    // 시스템 메시지 추가 함수
    const addSystemMessage = (content: string) => {
        if (!clientId) return;

        const systemMessage: ChatMessage = {
            sender: "system",
            receiver: clientId,
            content,
            sendAt: new Date().toISOString(),
            type: "SYSTEM",
        };
        setMessages((prev) => [...prev, systemMessage]);
    };

    // 특정 아이템 상담 시작 문구
    useImperativeHandle(ref, () => ({
        startItemChat(itemName: string) {
            setIsChatOpen(true);
            if (clientId) {
                connectStomp(clientId);
            }
            addSystemMessage(`${itemName} 아이템 상담을 시작합니다 🤗`);
        }, isOpen: () => isChatOpen,
    }));

    // 언마운트 시 연결 해제
    useEffect(() => {
        return () => {
            stompClientRef.current?.deactivate();
            stompClientRef.current = null;
        };
    }, []);

    // 메시지 스크롤 최신화
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    // 일반 메시지 전송
    const sendMessage = () => {
        if (stompClientRef.current && inputMessage.trim() !== "" && clientId) {
            const chatMessage: ChatMessage = {
                sender: clientId,
                receiver: "wishlist-admin",
                content: inputMessage,
                sendAt: new Date().toISOString(),
                type: "USER",
            };
            stompClientRef.current.publish({
                destination: "/app/chat.send",
                body: JSON.stringify(chatMessage),
            });
            setMessages((prev) => [...prev, chatMessage]);
            setInputMessage("");
        }
    };

    return (
        <>
            {/* 채팅 버튼 */}
            <div
                style={{
                    position: "fixed",
                    bottom: "40px",
                    right: "25px",
                    cursor: "pointer",
                    width: "60px",
                    height: "60px",
                    borderRadius: "50%",
                    backgroundColor: "white",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    zIndex: 1000,
                }}
                onClick={() => setIsChatOpen((prev) => !prev)}
            >
                <img
                    src="/wishlist_logo.svg"
                    alt="Chat Icon"
                    style={{ width: "40px", height: "40px" }}
                />
            </div>

            {/* 채팅창 */}
            {isChatOpen && (
                <div
                    style={{
                        position: "fixed",
                        bottom: "110px",
                        right: "25px",
                        width: "350px",
                        height: "450px",
                        borderRadius: "12px",
                        boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                        display: "flex",
                        flexDirection: "column",
                        backgroundColor: "white",
                        zIndex: 1000,
                        fontFamily: "'Poor Story', cursive",
                    }}
                >
                    {/* 메시지 영역 */}
                    <div
                        style={{
                            flex: 1,
                            overflowY: "auto",
                            padding: "14px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                        }}
                    >
                        <div
                            style={{
                                paddingBottom: "14px",
                                textAlign: "center",
                                color: "#6c757d",
                                fontSize: "14px",
                                borderBottom: "1px solid #eee",
                            }}
                        >
                            궁금한 점이 있으신가요? 문의하실 내용을 남겨주세요!<br />
                            아이템을 클릭하면 아이템에 대한 상담을 시작합니다 🤗
                        </div>

                        {messages.map((msg, index) =>
                            msg.type === "SYSTEM" ? (
                                <div
                                    key={index}
                                    style={{
                                        textAlign: "center",
                                        fontSize: "14px",
                                        padding: "8px 12px",
                                        backgroundColor: "#EAF4FF",
                                        color: "#4599E6",
                                        borderRadius: "12px",
                                        margin: "4px auto",
                                        maxWidth: "85%",
                                        fontWeight: 500,
                                    }}
                                >
                                    {msg.content}
                                </div>
                            ) : (
                                <div
                                    key={index}
                                    style={{
                                        display: "flex",
                                        alignItems: "flex-end",
                                        justifyContent:
                                            msg.sender === clientId ? "flex-end" : "flex-start",
                                        gap: "4px",
                                        maxWidth: "80%",
                                        marginLeft: msg.sender === clientId ? "auto" : undefined,
                                        marginRight: msg.sender === clientId ? undefined : "auto",
                                    }}
                                >
                                    {msg.sender === clientId && (
                                        <span
                                            style={{
                                                fontSize: "12px",
                                                color: "#6c757d",
                                            }}
                                        >
                                            {formatKST(msg.sendAt).slice(13, 19)}
                                        </span>
                                    )}

                                    <div
                                        style={{
                                            padding: "8px 12px",
                                            borderRadius: "15px",
                                            wordWrap: "break-word",
                                            backgroundColor:
                                                msg.sender === clientId ? "#4599E6" : "#D1DADE",
                                            color: msg.sender === clientId ? "white" : "black",
                                        }}
                                    >
                                        {msg.content}
                                    </div>

                                    {msg.sender !== clientId && (
                                        <span
                                            style={{
                                                fontSize: "12px",
                                                color: "#6c757d",
                                            }}
                                        >
                                            {formatKST(msg.sendAt).slice(13, 19)}
                                        </span>
                                    )}
                                </div>
                            )
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* 입력 영역 */}
                    <form
                        onSubmit={(e) => {
                            e.preventDefault();
                            sendMessage();
                        }}
                        style={{
                            display: "flex",
                            padding: "10px",
                            borderTop: "1px solid #eee",
                        }}
                    >
                        <input
                            type="text"
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            style={{
                                flex: 1,
                                padding: "10px",
                                borderRadius: "20px",
                                border: "1px solid #ccc",
                                color: "black",
                            }}
                            placeholder="메시지 입력..."
                        />
                        <button
                            type="submit"
                            style={{
                                marginLeft: "10px",
                                padding: "10px 15px",
                                borderRadius: "20px",
                                border: "none",
                                backgroundColor: "#4599E6",
                                color: "white",
                                cursor: "pointer",
                            }}
                        >
                            전송
                        </button>
                    </form>
                </div>
            )}
        </>
    );
});

export default ChatWidget;