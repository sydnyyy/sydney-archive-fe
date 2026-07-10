"use client";

import {CHAT_TYPE, ChatMessage, ChatMessageRequest} from "@/types/domain/chat/chat";
import React, {useEffect, useState} from "react";
import {useChatMessages} from "@/hooks/useChatMessages";
import {useChatScroll} from "@/hooks/useChatScroll";
import AnimatedMessages from "@/components/common/chat/AnimatedMessages";
import ChatInputButton from "@/components/common/chat/ChatInputButton";
import CloseButton from "@/components/common/button/CloseButton";

interface Props {
    chatRoomId: string;
    adminSid: string;
    stompClient: any;
    messages: ChatMessage[];
    setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
    onClose: () => void;
}

export default function AdminChatModal({
                                           chatRoomId,
                                           adminSid,
                                           stompClient,
                                           messages,
                                           setMessages,
                                           onClose
}: Props) {

    const [inputMessage, setInputMessage] = useState("");
    const { loadMessages, loadPreviousMessages } = useChatMessages();
    const [isInitialLoadDone, setIsInitialLoadDone] = useState(false);

    const { messagesContainerRef, messagesEndRef, handleScroll } = useChatScroll(
        messages,
        isInitialLoadDone,
        () => loadPreviousMessages(chatRoomId, messages),
        (older: ChatMessage[]) => setMessages((prev) => [...older, ...prev])
    );

    useEffect(() => {
        if (!chatRoomId) return;

        setMessages([]);
        setIsInitialLoadDone(false);

        loadMessages(chatRoomId).then((initialMessages) => {
            setMessages(initialMessages ?? []);
            setIsInitialLoadDone(true);
        });
    }, [chatRoomId]);

    const sendMessage = async () => {
        if (!inputMessage.trim()) return;

        const chatMessageRequest: ChatMessageRequest = {
            senderSid: adminSid,
            receiverSid: chatRoomId,
            content: inputMessage.trim(),
            type: CHAT_TYPE.ADMIN,
        };

        stompClient?.publish({
            destination: "/app/chat.sendToUser",
            body: JSON.stringify(chatMessageRequest),
        });

        setInputMessage("");
    };

    return (
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
            <header className="flex items-center justify-between mb-2">
                <CloseButton onClose={onClose} />
                <span>{chatRoomId}</span>
            </header>

            <div
                className="flex-1 overflow-auto mb-2 hide-scrollbar"
                onScroll={handleScroll}
                ref={messagesContainerRef}
            >
                <AnimatedMessages
                    messages={messages}
                    role="ADMIN"
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
    );
}
