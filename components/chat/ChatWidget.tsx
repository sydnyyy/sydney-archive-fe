"use client";

import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle } from "react";
import { Client } from "@stomp/stompjs";
import { createStompClient } from "@/lib/chat/socketClient";
import { ChatMessage } from "@/types/chat";
import { SystemEvent } from "@/types/system";
import { getOrCreateId } from "@/utils/clientId";
import { CLIENT_ID_KEY } from "@/constants/auth/storageKeys";
import { v4 as uuidv4 } from "uuid";
import { formatKST } from "@/utils/data";
import { fetchMessagesApi } from "@/lib/chat/fetchMessageApi";

import ChatList from "./ChatList";
import ChatInput from "./ChatInput";
import ChatButton from "./ChatButton";
import ChatCloseDialog from "./ChatCloseDialog";
import SystemEventDialog from "./SystemEventDialog";
import useAutoReply from "@/hooks/useAutoReply";

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
    const [showTopNotice, setShowTopNotice] = useState(true); // 최상단 안내문 상태
    const [systemEvent, setSystemEvent] = useState<SystemEvent | null>(null); //  시스템 이벤트 상태 (웹소켓 종료 여부)

    const containerRef = useRef<HTMLDivElement | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const stompClientRef = useRef<Client | null>(null);
    const keepConnectionRef = useRef(false);
    const isAdminJoined = useRef(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const id = getOrCreateId(localStorage, CLIENT_ID_KEY, 8);
            setClientId(id);
        }
    }, []);

    const { handleUserMessage } = useAutoReply(
        (msg: ChatMessage) => {
            setMessages(prev => [...prev, msg]);

            requestAnimationFrame(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            });
        },
        isAdminJoined,
        clientId || ""
    );

    const loadMessages = async (cursorId?: string, isInitial = false): Promise<ChatMessage[]> => {
        if (!clientId) return [];

        try {
            const data = await fetchMessagesApi(clientId, false, cursorId);

            if (cursorId) {
                setMessages(prev => {
                    const ids = new Set(prev.map(m => m.id));
                    const filtered = data.filter(m => !ids.has(m.id));
                    return [...filtered, ...prev];
                });
            } else {
                setMessages([...data]);

                if (isInitial) {
                    requestAnimationFrame(() => {
                        messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
                    });
                }
            }
            return data;
        } catch (err) {
            console.error("메시지 불러오기 실패", err);
            return [];
        }
    };

    const loadPreviousMessages = async (): Promise<ChatMessage[]> => {
        if (!messages.length) return [];
        const oldestMessage = messages[0];
        return await loadMessages(oldestMessage.id);
    };

    useEffect(() => {
        if (isChatOpen && clientId && !stompClientRef.current) {
            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            stompClientRef.current = createStompClient({
                url: `${baseUrl}/ws?client_id=${clientId}`,
                reconnectDelay: keepConnectionRef.current ? 5000 : 0,
                role: "user",
                subscribePaths: [
                    {
                        path: "/user/queue/chat.messages",
                        onMessage: handleIncomingMessageWithAdminCheck,
                    },
                    {
                        path: "/user/queue/system",
                        onMessage: (event) => {
                            if (event.type === "SESSION_EXPIRED") {
                                if (event.shouldTerminate) {
                                    disconnectWebSocket();
                                } else {
                                    setSystemEvent(event);
                                }
                            }
                        },
                    },
                ],
            });
            loadMessages(undefined, true);
        }

        return () => {
            if (!keepConnectionRef.current) {
                disconnectWebSocket();
            }
        };
    }, [isChatOpen, clientId]);

    const addSystemMessage = (content: string) => {
        if (!clientId) return;

        const systemMessage: ChatMessage = {
            id: uuidv4(),
            sender: "system",
            receiver: clientId,
            content,
            sendAt: new Date().toISOString(),
            type: "SYSTEM",
        };
        setMessages(prev => [...prev, systemMessage]);

        if (stompClientRef.current) {
            stompClientRef.current.publish({
                destination: "/app/chat.send",
                body: JSON.stringify(systemMessage),
            });
        }

        requestAnimationFrame(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        });
    };

    useImperativeHandle(ref, () => ({
        startItemChat(itemName: string) {
            setIsChatOpen(true);
            addSystemMessage(`${itemName} 아이템 상담을 시작합니다 🤗`);
        },
        addChatMessageWithOptions(message) {
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

    const sendMessage = () => {
        if (!stompClientRef.current || inputMessage.trim() === "" || !clientId) return;

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
        setInputMessage("");
        handleUserMessage();

        requestAnimationFrame(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        });
    };

    const handleIncomingMessageWithAdminCheck = (message: ChatMessage) => {
        if (message.sender === "wishlist-admin") {
            isAdminJoined.current = true;
        }

        setMessages(prev => [...prev, message]);
        requestAnimationFrame(() => {
            messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        });
    };

    const handleOptionClick = (value: "yes" | "no") => {
        onOptionSelect?.(value);
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
            setShowTopNotice(true);
            keepConnectionRef.current = false;
        } else {
            keepConnectionRef.current = true;
        }

        setIsChatOpen(false);
        setShowCloseDialog(false);
    };

    return (
        <>
            <ChatButton onClick={handleChatToggle} />

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
                    }}>
                    <ChatList
                        messages={messages}
                        clientId={clientId}
                        messagesEndRef={messagesEndRef}
                        containerRef={containerRef}
                        onOptionClick={handleOptionClick}
                        formatKST={formatKST}
                        onLoadPrevious={loadPreviousMessages}
                        showTopNotice={showTopNotice}
                        setShowTopNotice={setShowTopNotice}
                    />
                    <ChatInput
                        inputMessage={inputMessage}
                        onChange={setInputMessage}
                        onSend={sendMessage}
                    />
                </div>
            )}

            {showCloseDialog && <ChatCloseDialog onConfirm={handleChatCloseConfirm} />}

            {systemEvent && (
                <SystemEventDialog
                    onDecision={(decision) => {
                        stompClientRef.current?.publish({
                            destination: "/app/system.response",
                            body: JSON.stringify({ ...systemEvent, shouldTerminate: decision }),
                        });
                        setSystemEvent(null);
                    }}
                />
            )}
        </>
    );
});

export default ChatWidget;