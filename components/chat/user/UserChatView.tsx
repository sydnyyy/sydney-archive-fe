"use client";

import React, { useState, useEffect, useRef, forwardRef, useImperativeHandle, useLayoutEffect } from "react";
import { Client } from "@stomp/stompjs";
import { createStompClient } from "@/lib/chat/socketClient";
import { CHAT_TYPE, ChatMessage } from "@/types/chat";
import { SystemEvent } from "@/types/system";
import { getOrCreateTabId } from "@/utils/clientId";
import { v4 as uuidv4 } from "uuid";
import AnimatedMessages from "@/components/chat/common/AnimatedMessages";

import ChatInput from "./ChatInput";
import ChatCloseDialog from "./ChatCloseDialog";
import SystemEventDialog from "./SystemEventDialog";
import useAutoReply from "@/hooks/useAutoReply";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useChatScroll } from "@/hooks/useChatScroll";
import { Item } from "@/lib/types";

export interface UserChatViewRef {
    startItemChat: (itemName?: string) => void;
    isOpen: () => boolean;
    removeLastOptionMessage: () => void;
    addSystemMessage: (content: string) => void;
    handleChatToggle: () => void;
}

interface UserChatViewProps {
    isChatOpen: boolean;
    setIsChatOpen: (open: boolean) => void;
    clientId: string;
    selectedItem: Item | null;
}

const UserChatView = forwardRef<UserChatViewRef, UserChatViewProps>(
    (
        { isChatOpen, setIsChatOpen, clientId, selectedItem },
        ref
    ) => {

    const [inputMessage, setInputMessage] = useState<string>("");
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [showCloseDialog, setShowCloseDialog] = useState(false);
    const [hasMoreMessages, setHasMoreMessages] = useState(true);
    const [systemEvent, setSystemEvent] = useState<SystemEvent | null>(null); //  시스템 이벤트 상태 (웹소켓 종료 여부)
    const [isInitialLoadDone, setIsInitialLoadDone] = useState(false);

    const stompClientRef = useRef<Client | null>(null);
    const keepConnectionRef = useRef(false);
    const isAdminJoined = useRef(false);

    const { loadMessages, loadPreviousMessages } = useChatMessages();
    const { messagesContainerRef, messagesEndRef, handleScroll } = useChatScroll(
        messages,
        isInitialLoadDone,
        async () => {
            if (!clientId) return [];
            return await loadPreviousMessages(clientId, false, messages);
        },
        (older) => setMessages(prev => [...older, ...prev]),
        () => setHasMoreMessages(false)
    );

    const { handleUserMessage } = useAutoReply(
        (msg: ChatMessage) => setMessages(prev => [...prev, msg]),
        isAdminJoined,
        clientId || ""
    );

    useLayoutEffect(() => {
        if (messagesContainerRef.current && isInitialLoadDone) {
            messagesContainerRef.current?.scrollTo({
                top: messagesContainerRef.current.scrollHeight,
                behavior: "auto",
            });
        }
    }, [messages, isInitialLoadDone]);

    const disconnectWebSocket = () => {
        if (stompClientRef.current) {
            stompClientRef.current.deactivate();
            stompClientRef.current = null;
        }
    };

    const resetChatState = () => {
        disconnectWebSocket();
        setMessages([]);
        setHasMoreMessages(true);
        setIsInitialLoadDone(false);
        messagesContainerRef.current?.scrollTo({ top: 0 });
    };

    useEffect(() => {
        if (isChatOpen && clientId && !stompClientRef.current) {
            const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
            const tabId = getOrCreateTabId();

            stompClientRef.current = createStompClient({
                url: `${baseUrl}/ws?client_id=${clientId}&tab_id=${tabId}`,
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
                                    resetChatState();
                                } else {
                                    setSystemEvent(event);
                                }
                            }
                        },
                    },
                ],

                // 아이템 open → 채팅 open
                fetchInitialSystemMessage: async () => {
                    if (selectedItem) {
                        addSystemMessage(`${selectedItem.title} 아이템 상담을 시작합니다 🤗`);
                    }
                },
            });

            // 첫 화면 최신 메시지 로딩
            loadMessages(clientId, false).then((initialMessages) => {
                if (initialMessages?.length) {
                    setMessages(initialMessages);
                    setIsInitialLoadDone(true);
                }
            });
        }

        return () => {
            if (!keepConnectionRef.current) {
                resetChatState();
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
            type: CHAT_TYPE.SYSTEM,
        };

        if (stompClientRef.current) {
            stompClientRef.current.publish({
                destination: "/app/chat.send",
                body: JSON.stringify(systemMessage),
            });
        }
    };

    useImperativeHandle(ref, () => ({
        // 채팅 open → 아이템 open
        startItemChat(itemName?: string) {
            setIsChatOpen(true);
            if (itemName) {
                addSystemMessage(`${itemName} 아이템 상담을 시작합니다 🤗`);
            }
        },
        isOpen: () => isChatOpen,
        removeLastOptionMessage() {
            setMessages(prev => prev.filter(msg => !msg.options));
        },
        addSystemMessage,
        handleChatToggle,
    }));

    const sendMessage = () => {
        if (!stompClientRef.current || inputMessage.trim() === "" || !clientId) return;

        const chatMessage: ChatMessage = {
            sender: clientId,
            receiver: "wishlist-admin",
            content: inputMessage,
            sendAt: new Date().toISOString(),
            type: CHAT_TYPE.USER,
        };
        stompClientRef.current.publish({
            destination: "/app/chat.send",
            body: JSON.stringify(chatMessage),
        });
        setInputMessage("");
        handleUserMessage();
    };

    const handleIncomingMessageWithAdminCheck = (message: ChatMessage) => {
        if (message.sender === "wishlist-admin") {
            isAdminJoined.current = true;
        }

        setMessages(prev => [...prev, message]);
    };

    const handleChatToggle = () => {
        if (isChatOpen) {
            setShowCloseDialog(true);
        } else {
            setIsChatOpen(true);
        }
    };

    const handleChatCloseConfirm = (shouldClose: boolean) => {
        if (shouldClose) {
            resetChatState();
            keepConnectionRef.current = false;
        } else {
            keepConnectionRef.current = true;
        }

        setIsChatOpen(false);
        setShowCloseDialog(false);
    };

    return (
        <>
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
                    <div
                        ref={messagesContainerRef}
                        onScroll={handleScroll}
                        className="flex-1 overflow-y-auto px-2 py-2 space-y-2 hide-scrollbar"
                    >
                        {(!messages.length || !hasMoreMessages) && (
                            <div className="mt-2 pb-2 pr-2 text-right text-[14px] text-[#6c757d] border-b border-[#eee]">
                                문의하실 내용을 남겨주세요!<br />
                                아이템을 클릭하면 아이템에 대한 상담을 할 수 있어요. 🤗
                            </div>
                        )}
                        <AnimatedMessages
                            messages={messages}
                            myRole="USER"
                        />
                        <div ref={messagesEndRef} />
                    </div>
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

export default UserChatView;