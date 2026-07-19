"use client";

import {CHAT_TYPE, ChatMessage, ChatMessageRequest} from "@/types/domain/chat/chat";
import React, {useEffect, useState} from "react";
import {useChatMessages} from "@/hooks/useChatMessages";
import {useChatScroll} from "@/hooks/useChatScroll";
import AnimatedMessages from "@/components/chat/AnimatedMessages";
import ChatInputButton from "@/components/chat/ChatInputButton";
import CloseButton from "@/components/common/button/CloseButton";
import {TrashIcon} from "@heroicons/react/24/outline";
import {useAdminAuth} from "@/app/providers/admin/AdminAuthProvider";
import {deleteChatRoomApi} from "@/lib/api/admin/chat/chat.command";

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

    const { accessToken, refreshAccessToken } = useAdminAuth();

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

    const handleDelete = async () => {
        if (!accessToken) {
            console.error("Access token is missing. The operation failed.");
            return;
        }

        if (!chatRoomId) {
            alert("삭제할 chatRoomId 값은 필수입니다.");
            return;
        }

        const isConfirmed = confirm("채팅방을 삭제합니다.");
        if (isConfirmed) {
            try {
                await deleteChatRoomApi(chatRoomId, accessToken, refreshAccessToken);
                alert("삭제되었습니다.");
            } catch (error) {
                console.error(error);
            } finally {
                onClose();
            }
        }
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
                <div className="flex items-center gap-3">
                    <span>{chatRoomId}</span>
                    <button
                        onClick={handleDelete}
                        className="flex items-center justify-center px-4.5 py-1.5 border rounded-xl"
                    >
                        <TrashIcon className="h-5 w-5" />
                    </button>
                </div>
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
