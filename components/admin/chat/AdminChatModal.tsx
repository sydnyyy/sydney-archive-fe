"use client";

import {CHAT_TYPE, ChatMessage, ChatMessageRequest} from "@/types/domain/chat/chat";
import {XMarkIcon} from "@heroicons/react/24/outline";
import React, {useEffect, useState} from "react";
import {useChatMessages} from "@/hooks/useChatMessages";
import {useChatScroll} from "@/hooks/useChatScroll";
import AnimatedMessages from "@/components/common/chat/AnimatedMessages";
import ChatInputButton from "@/components/common/chat/ChatInputButton";

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

        loadMessages(chatRoomId).then((initialMessages) => {
            if (initialMessages?.length) {
                setMessages(initialMessages);
                setIsInitialLoadDone(true);
            }
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div
                className="
                    flex max-h-[80vh] w-[600px] flex-col overflow-hidden p-3
                    rounded-md
                    border border-[var(--color-admin-chat-border)]
                    bg-[var(--color-chat-bg)]
                "
            >
                <div className="flex items-center justify-between mb-2.5">
                    <h3 className="font-bold">{chatRoomId}</h3>

                    <button onClick={onClose}>
                        <XMarkIcon className="h-6 w-6"/>
                    </button>
                </div>

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
        </div>
    );
}
