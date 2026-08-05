"use client";

import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import {CHAT_TYPE, ChatMessage, ChatMessageRequest} from "@/types/domain/chat/chat";
import AnimatedMessages from "@/components/chat/AnimatedMessages";

import ChatInputButton from "@/components/chat/ChatInputButton";
import useAutoReply from "@/hooks/useAutoReply";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useChatScroll } from "@/hooks/useChatScroll";
import { Item } from "@/types/domain/item/item";
import {useAuthStore} from "@/store/useAuthStore";
import {useWebSocket} from "@/app/providers/user/WebSocketProvider";
import CloseButton from "@/components/common/button/CloseButton";

interface UserChatViewProps {
    setIsChatOpen: (open: boolean) => void;
    selectedItem?: Item | null;
}

export default function ChatModal({
                                         setIsChatOpen,
                                         selectedItem
                                     }: UserChatViewProps) {

    const [inputMessage, setInputMessage] = useState<string>("");
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isInitialLoadDone, setIsInitialLoadDone] = useState(false);

    const { stompClient, chatMessage } = useWebSocket();
    const isAdminJoined = useRef(false);

    const { uid } = useAuthStore();
    const { loadMessages, loadPreviousMessages } = useChatMessages();
    const { messagesContainerRef, messagesEndRef, handleScroll } = useChatScroll(
        messages,
        isInitialLoadDone,
        async () => {
            if (!uid) return [];
            return await loadPreviousMessages(uid, messages);
        },
        (older) => setMessages(prev => [...older, ...prev]),
    );

    const { addAutoReply } = useAutoReply(
        uid || "",
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
        if (uid && stompClient) {
            loadMessages(uid).then((initialMessages) => {
                if (initialMessages?.length) {
                    setMessages(initialMessages);
                    setIsInitialLoadDone(true);
                }
            });
        }

        return () => {
            clearChatState();
        };
    }, [uid, stompClient]);

    useEffect(() => {
        if (chatMessage == null) return;

        if (chatMessage.senderUid === "admin") {
            isAdminJoined.current = true;
        }

        setMessages(prev => [...prev, chatMessage]);
    }, [chatMessage]);

    const sendMessage = () => {
        if (!stompClient?.active || inputMessage.trim() === "" || !uid) return;

        const chatMessageRequest: ChatMessageRequest = {
            senderUid: uid,
            receiverUid: "admin",
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