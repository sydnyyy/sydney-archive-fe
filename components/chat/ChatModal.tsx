"use client";

import React, { useState, useEffect, useRef, useLayoutEffect } from "react";
import {CHAT_TYPE, ChatMessage, ChatMessageRequest} from "@/types/domain/chat/chat";
import AnimatedMessages from "@/components/common/chat/AnimatedMessages";
import { XMarkIcon } from "@heroicons/react/24/outline"

import ChatInputButton from "@/components/common/chat/ChatInputButton";
import useAutoReply from "@/hooks/useAutoReply";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useChatScroll } from "@/hooks/useChatScroll";
import { Item } from "@/types/domain/item/item";
import {useAuthStore} from "@/store/useAuthStore";
import {useWebSocket} from "@/app/providers/user/WebSocketProvider";

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

    const { sid } = useAuthStore();
    const { loadMessages, loadPreviousMessages } = useChatMessages();
    const { messagesContainerRef, messagesEndRef, handleScroll } = useChatScroll(
        messages,
        isInitialLoadDone,
        async () => {
            if (!sid) return [];
            return await loadPreviousMessages(sid, messages);
        },
        (older) => setMessages(prev => [...older, ...prev]),
    );

    const { addAutoReply } = useAutoReply(
        sid || "",
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
        if (sid && stompClient) {
            loadMessages(sid).then((initialMessages) => {
                if (initialMessages?.length) {
                    setMessages(initialMessages);
                    setIsInitialLoadDone(true);
                }
            });
        }

        return () => {
            clearChatState();
        };
    }, [sid, stompClient]);

    useEffect(() => {
        if (chatMessage == null) return;

        if (chatMessage.senderSid === "admin") {
            isAdminJoined.current = true;
        }

        setMessages(prev => [...prev, chatMessage]);
    }, [chatMessage]);

    const sendMessage = () => {
        if (!stompClient?.active || inputMessage.trim() === "" || !sid) return;

        const chatMessageRequest: ChatMessageRequest = {
            senderSid: sid,
            receiverSid: "admin",
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
                    fixed top-1/2 -translate-y-1/2 right-[210px] p-3
                    w-[350px] min-h-[450px] max-h-[600px]
                    flex flex-col
                    rounded-xl shadow-2xl z-[1000] bg-[var(--color-chat-bg)]
                "
            >
                <div>
                    <button onClick={() => setIsChatOpen(false)} >
                        <XMarkIcon className="h-6 w-6" />
                    </button>
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