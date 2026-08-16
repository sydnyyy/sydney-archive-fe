"use client";

import React, {useEffect, useLayoutEffect, useRef, useState} from "react";
import {CHAT_TYPE, ChatMessage, ChatMessageRequest} from "@/types/domain/chat/chat";
import AnimatedMessages from "@/components/chat/AnimatedMessages";

import ChatInputButton from "@/components/chat/ChatInputButton";
import useAutoReply from "@/hooks/useAutoReply";
import {useChatMessages} from "@/hooks/useChatMessages";
import {useChatScroll} from "@/hooks/useChatScroll";
import {useWebSocket} from "@/app/providers/user/WebSocketProvider";
import CloseButton from "@/components/common/button/CloseButton";
import {UserRole} from "@/types/domain/user/user";
import {useUserAuth} from "@/app/providers/user/AuthProvider";

interface UserChatViewProps {
    setIsChatOpen: (open: boolean) => void;
}

export default function ChatModal({
                                      setIsChatOpen
}: UserChatViewProps) {

    const [inputMessage, setInputMessage] = useState<string>("");
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isInitialLoadDone, setIsInitialLoadDone] = useState(false);

    const { stompClient, chatMessage } = useWebSocket();
    const isAdminJoined = useRef(false);

    const { user, accessToken, refreshAccessToken } = useUserAuth();
    const { loadMessages, loadPreviousMessages } = useChatMessages();
    const { messagesContainerRef, messagesEndRef, handleScroll } = useChatScroll(
        messages,
        isInitialLoadDone,
        async () => {
            if (!user?.userId || !accessToken) return [];
            return await loadPreviousMessages(user.userId, accessToken, refreshAccessToken, UserRole.GUEST, messages);
        },
        (older) => setMessages(prev => [...older, ...prev]),
    );

    const { addAutoReply } = useAutoReply(
        user?.userId || "",
        (msg: ChatMessage) => setMessages(prev => [...prev, msg]),
        isAdminJoined,
    );

    useLayoutEffect(() => {
        if (messagesContainerRef.current && isInitialLoadDone) {
            messagesContainerRef.current?.scrollTo({
                top: messagesContainerRef.current.scrollHeight,
                behavior: "auto",
            });
        }
    }, [messages, isInitialLoadDone]);

    const clearChatState = () => {
        setMessages([]);
        setIsInitialLoadDone(false);
        messagesContainerRef.current?.scrollTo({ top: 0 });
    };

    useEffect(() => {
        if (user?.userId && accessToken && stompClient) {
            loadMessages(user.userId, accessToken, refreshAccessToken, UserRole.GUEST)
                .then((initialMessages) => {
                    if (initialMessages?.length) {
                        setMessages(initialMessages);
                        setIsInitialLoadDone(true);
                    }
                });
        }

        return () => {
            clearChatState();
        };
    }, [accessToken, stompClient]);

    useEffect(() => {
        if (chatMessage == null) return;

        if (chatMessage.senderUserId === "admin") {
            isAdminJoined.current = true;
        }

        setMessages(prev => [...prev, chatMessage]);
    }, [chatMessage]);

    const sendMessage = () => {
        if (!stompClient?.active
            || inputMessage.trim() === ""
            || !accessToken
            || !user?.userId
        ) return;

        const chatMessageRequest: ChatMessageRequest = {
            senderUserId: user.userId,
            receiverUserId: "admin",
            content: inputMessage,
            type: CHAT_TYPE.USER,
        };

        stompClient?.publish({
            destination: "/app/chat.send",
            body: JSON.stringify(chatMessageRequest),
        });

        setInputMessage("");
        addAutoReply();
    };

    return (
        <>
            <div
                className="
                    fixed top-1/2 -translate-y-1/2 p-3
                    right-5 xl:right-[210px]
                    w-[350px]
                    min-h-[450px] max-h-[600px]
                    flex flex-col
                    rounded-xl shadow-2xl z-[1000] bg-[var(--color-chat-bg)]
                "
            >
                <div>
                    <CloseButton onClose={() => setIsChatOpen(false)} />
                </div>

                <div
                    className="flex-1 overflow-y-auto mb-2 hide-scrollbar"
                    ref={messagesContainerRef}
                    onScroll={handleScroll}
                >
                    <AnimatedMessages
                        messages={messages}
                        role="USER"
                    />
                    <div ref={messagesEndRef} />
                </div>

                <div>
                    <ChatInputButton
                        inputMessage={inputMessage}
                        onChange={setInputMessage}
                        onSend={sendMessage}
                    />
                </div>
            </div>
        </>
    );
};