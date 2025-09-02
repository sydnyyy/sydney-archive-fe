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
import { getOrCreateId } from "@/utils/clientId";
import { CLIENT_ID_KEY } from "@/constants/auth/storageKeys";
import { v4 as uuidv4 } from "uuid";
import { formatKST } from "@/utils/data";

import ChatList from "./ChatList";
import ChatInput from "./ChatInput";
import ChatButton from "./ChatButton";
import ChatCloseDialog from "./ChatCloseDialog";

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
    const keepConnectionRef = useRef(false);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const id = getOrCreateId(localStorage, CLIENT_ID_KEY, 8);
            setClientId(id);
        }
    }, []);

    // STOMP 연결
    useEffect(() => {
        if (isChatOpen && clientId && !stompClientRef.current) {
            stompClientRef.current = createStompClient({
                url: `http://localhost:8080/ws?client_id=${clientId}`,
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
            if (!keepConnectionRef.current) {
                stompClientRef.current?.deactivate();
                stompClientRef.current = null;
            }
        };
    }, [isChatOpen, clientId]);

    // 시스템 메시지 추가 함수
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

    // 메시지 스크롤 최신화
    useEffect(() => {
        if (isChatOpen && messages.length > 0) {
            requestAnimationFrame(() => {
                messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
            });
        }
    }, [isChatOpen, messages]);

    // 일반 메시지 전송
    const sendMessage = () => {
        if (!stompClientRef.current || inputMessage.trim() === "" || !clientId) return;

        const chatMessage: ChatMessage = {
            id: uuidv4(),
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
            keepConnectionRef.current = false;
        }
        else {
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
                        fontFamily: "'Poor Story', cursive",
                    }}>
                    <ChatList
                        messages={messages}
                        clientId={clientId}
                        messagesEndRef={messagesEndRef}
                        onOptionClick={handleOptionClick}
                        formatKST={formatKST}
                    />
                    <ChatInput
                        inputMessage={inputMessage}
                        onChange={setInputMessage}
                        onSend={sendMessage}
                    />
                </div>
            )}

            {showCloseDialog && <ChatCloseDialog onConfirm={handleChatCloseConfirm} />}
        </>
    );
});

export default ChatWidget;