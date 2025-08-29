"use client";

import React, {
    useState,
    useEffect,
    useRef,
    forwardRef,
    useImperativeHandle,
} from "react";
import { Client } from "@stomp/stompjs";
import { createStompClient } from "@/lib/chat/socketClient";
import { ChatMessage } from "@/types/chat";
import { formatKST } from "@/utils/data";
import { getOrCreateId } from "@/utils/clientId";
import { CLIENT_ID_KEY } from "@/constants/auth/storageKeys";

export interface ChatWidgetRef {
    startItemChat: (itemName: string) => void;
    addChatMessageWithOptions: (message: { content: string; options: { label: string; value: string }[] }) => void;
    isOpen: () => boolean;
    removeLastOptionMessage: () => void;
    addSystemMessage: (content: string) => void;
}

interface ChatWidgetProps {
    onOptionSelect?: (value: "yes" | "no") => void;
}

const ChatWidget = forwardRef<ChatWidgetRef, ChatWidgetProps>(({ onOptionSelect }, ref) => {
    const [isChatOpen, setIsChatOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputMessage, setInputMessage] = useState<string>("");
    const [clientId, setClientId] = useState<string | null>(null);
    const [showCloseDialog, setShowCloseDialog] = useState(false);

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const stompClientRef = useRef<Client | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const id = getOrCreateId(localStorage, CLIENT_ID_KEY, 8);
            setClientId(id);
        }
    }, []);

    // STOMP 연결
    useEffect(() => {
        if (isChatOpen && clientId) {
            stompClientRef.current = createStompClient({
                url: `http://localhost:8080/ws?clientId=${clientId}`,
                subscribePath: "/user/queue/chat.messages",
                role: "user",
                onMessage: (msg) => {
                    if (msg.sender === "wishlist-admin") {
                        setMessages((prev) => [...prev, msg]);
                    }
                },
            });
        }

        return () => {
            stompClientRef.current?.deactivate();
            stompClientRef.current = null;
        };
    }, [isChatOpen, clientId]);

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

        if (stompClientRef.current) {
            stompClientRef.current.publish({
                destination: "/app/chat.send",
                body: JSON.stringify(systemMessage),
            });
        }
    };

    // 특정 아이템 상담 시작 문구
    useImperativeHandle(ref, () => ({
        startItemChat(itemName: string) {
            setIsChatOpen(true);
            addSystemMessage(`${itemName} 아이템 상담을 시작합니다 🤗`);
        },
        addChatMessageWithOptions(message: { content: string; options: { label: string; value: string }[] }) {
            setIsChatOpen(true);
            setMessages(prev => [
                ...prev,
                {
                    ...message,
                    sender: "system",
                    receiver: clientId,
                    type: "SYSTEM",
                    sendAt: new Date().toISOString()
                } as ChatMessage,
            ]);
        },
        isOpen: () => isChatOpen,
        removeLastOptionMessage() {
            setMessages(prev => prev.filter(msg => !msg.options));
        },
        addSystemMessage,
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
        if (isChatOpen && messages.length > 0) {
            const timeout = setTimeout(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            }, 0);
            return () => clearTimeout(timeout);
        }
    }, [isChatOpen, messages]);

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

    const handleOptionClick = (value: "yes" | "no") => {
        if (onOptionSelect) onOptionSelect(value);
    };

    const handleChatToggle = () => {
        if (isChatOpen) {
            setShowCloseDialog(true);
        } else {
            setIsChatOpen(true);
        }
    };

    const disconnectWebSocket = () => {
        if (stompClientRef.current) {
            stompClientRef.current.deactivate();
            stompClientRef.current = null;
        }
    };

    const handleChatCloseConfirm = (shouldClose: boolean) => {
        if (shouldClose) {
            disconnectWebSocket();
            setMessages([]);
        }

        setIsChatOpen(false);
        setShowCloseDialog(false);
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
                onClick={handleChatToggle}
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

                                    {/* options 렌더링 */}
                                    {msg.options?.length ? (
                                        <div style={{ marginTop: "8px", display: "flex", justifyContent: "center", gap: "6px" }}>
                                            {msg.options.map((opt) => (
                                                <button
                                                    key={opt.value}
                                                    onClick={() => handleOptionClick(opt.value as "yes" | "no")}
                                                    style={{
                                                        padding: "6px 12px",
                                                        borderRadius: "12px",
                                                        border: "1px solid #4599E6",
                                                        backgroundColor: "white",
                                                        color: "#4599E6",
                                                        cursor: "pointer",
                                                    }}
                                                >
                                                    {opt.label}
                                                </button>
                                            ))}
                                        </div>
                                    ) : null}

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

            {showCloseDialog && (
                <div
                    style={{
                        position: "fixed",
                        top: 0,
                        left: 0,
                        width: "100vw",
                        height: "100vh",
                        backgroundColor: "rgba(0,0,0,0.3)",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        zIndex: 2000,
                    }}
                >
                    <div
                        style={{
                            backgroundColor: "white",
                            padding: "20px",
                            borderRadius: "12px",
                            minWidth: "280px",
                            textAlign: "center",
                            boxShadow: "0 8px 24px rgba(0,0,0,0.2)",
                        }}
                    >
                        <p style={{ marginBottom: "13px", color: "#6c757d", fontSize: "14px" }}>
                            상담을 종료하시겠습니까?<br/>
                            <strong>유지</strong> 선택 시 창은 닫히지만, 채팅 내용은 그대로 남습니다.
                        </p>
                        <div style={{ display: "flex", justifyContent: "space-around", gap: "12px" }}>
                            <button
                                onClick={() => handleChatCloseConfirm(true)}
                                style={{
                                    flex: 1,
                                    padding: "11px 0",
                                    borderRadius: "8px",
                                    border: "none",
                                    backgroundColor: "#4599E6",
                                    color: "white",
                                    fontSize: "14px",
                                    fontWeight: 450,
                                    cursor: "pointer",
                                }}
                            >
                                종료
                            </button>
                            <button
                                onClick={() => handleChatCloseConfirm(false)}
                                style={{
                                    flex: 1,
                                    padding: "11px 0",
                                    borderRadius: "8px",
                                    border: "1px solid #4599E6",
                                    backgroundColor: "white",
                                    color: "#4599E6",
                                    fontSize: "14px",
                                    fontWeight: 450,
                                    cursor: "pointer",
                                }}
                            >
                                유지
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
});

export default ChatWidget;