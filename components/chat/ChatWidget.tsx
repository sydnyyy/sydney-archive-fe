import React, { useState, useEffect, useRef } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { v4 as uuidv4 } from "uuid";
import { CLIENT_ID_KEY } from "@/constants/auth/storageKeys";

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

interface ChatMessage {
    clientId: string;
    content: string;
    sendAt: string;
}

const ChatWidget: React.FC = () => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputMessage, setInputMessage] = useState<string>('');

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
        if (stompClientRef.current) return; // 이미 연결되어 있으면 무시

        const client = new Client({
            webSocketFactory: () => new SockJS(`http://localhost:8080/ws?clientId=${id}`),
            reconnectDelay: 5000,
            onConnect: () => {
                console.log("🟢 STOMP 연결 성공");
                client.subscribe(`/user/queue/chat.messages`, (message) => {

                    console.log("Raw STOMP message received:", message);

                    const chatMessage: ChatMessage = JSON.parse(message.body);
                    if (chatMessage.clientId === 'wishlist-admin') {
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

    // 채팅 버튼 클릭 → 연결 시도
    const handleChatButtonClick = () => {
        setIsChatOpen((prev) => !prev);
        if (!stompClientRef.current && !isChatOpen && clientId) {
            connectStomp(clientId);
        }
    };

    // 언마운트 시 연결 해제
    useEffect(() => {
        return () => {
            stompClientRef.current?.deactivate();
            stompClientRef.current = null;
        };
    }, []);

    // 메시지 스크롤을 최신 메시지로 이동
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // 메시지 전송
    const sendMessage = () => {
        if (stompClientRef.current && inputMessage.trim() !== "" && clientId) {
            const chatMessage: ChatMessage = {
                clientId: clientId,
                content: inputMessage,
                sendAt: new Date().toISOString(),
            };
            stompClientRef.current.publish({
                destination: "/app/chat.send", // 서버 @MessageMapping 주소
                body: JSON.stringify(chatMessage),
            });
            setMessages((prev) => [...prev, chatMessage]); // 내 메시지 UI 반영
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
                onClick={handleChatButtonClick}
            >
                <img src="/wishlist_logo.svg" alt="Chat Icon" style={{ width: "40px", height: "40px" }} />
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
                    }}
                >
                    {/* 메시지 영역 */}
                    <div
                        style={{
                            flex: 1,
                            overflowY: "auto",
                            padding: "10px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "10px",
                        }}
                    >
                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                style={{
                                    maxWidth: "80%",
                                    padding: "8px 12px",
                                    borderRadius: "18px",
                                    wordWrap: "break-word",
                                    alignSelf:
                                        msg.clientId === clientId ? "flex-end" : "flex-start",
                                    backgroundColor:
                                        msg.clientId === clientId ? "#3f51b5" : "#e0e0e0",
                                    color: msg.clientId === clientId ? "white" : "black",
                                }}
                            >
                                {msg.content}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* 입력 영역 */}
                    <div
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
                            onKeyDown={(e) => {
                                if (e.key === "Enter") sendMessage();
                            }}
                            style={{
                                flex: 1,
                                padding: "10px",
                                borderRadius: "20px",
                                border: "1px solid #ccc",
                            }}
                            placeholder="메시지 입력..."
                        />
                        <button
                            onClick={sendMessage}
                            style={{
                                marginLeft: "10px",
                                padding: "10px 15px",
                                borderRadius: "20px",
                                border: "none",
                                backgroundColor: "#3f51b5",
                                color: "white",
                                cursor: "pointer",
                            }}
                        >
                            전송
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default ChatWidget;