"use client";

import { CHAT_TYPE, ChatMessage } from "@/types/domain/chat/chat";
import { useState, useEffect } from "react";
import AnimatedMessages from "@/components/chat/common/AnimatedMessages";
import { useChatMessages } from "@/hooks/useChatMessages";
import { useChatScroll } from "@/hooks/useChatScroll";

interface AdminChatViewProps {
    userSid: string;
    adminSid: string;
    stompClient: any;
    messages: ChatMessage[];
    setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
}

export default function AdminChatView({
                                          userSid,
                                          adminSid,
                                          stompClient,
                                          messages,
                                          setMessages,
                                      }: AdminChatViewProps) {

    const [input, setInput] = useState("");
    const { loadMessages, loadPreviousMessages } = useChatMessages();
    const [isInitialLoadDone, setIsInitialLoadDone] = useState(false);

    const { messagesContainerRef, messagesEndRef, handleScroll } = useChatScroll(
        messages,
        isInitialLoadDone,
        () => loadPreviousMessages(userSid, true, messages),
        (older: ChatMessage[]) => setMessages((prev) => [...older, ...prev])
    );

    // 첫 화면 최신 메시지 로딩
    useEffect(() => {
        if (!userSid) return;

        loadMessages(userSid, true).then((initialMessages) => {
            if (initialMessages?.length) {
                setMessages(initialMessages);
                setIsInitialLoadDone(true);
            }
        });
    }, [userSid]);

    const sendMessage = async () => {
        if (!input.trim()) return;

        const chatMessage: ChatMessage = {
            senderSid: adminSid,
            receiverSid: userSid,
            content: input.trim(),
            sendAt: new Date().toISOString(),
            type: CHAT_TYPE.ADMIN,
        };

        stompClient?.publish({
            destination: "/app/chat.sendToUser",
            body: JSON.stringify(chatMessage),
        });

        setInput("");
    };

    return (
        <div className="flex flex-col flex-1 p-3 overflow-auto">
            <div
                className="flex-1 overflow-auto mb-2 hide-scrollbar"
                onScroll={handleScroll}
                ref={messagesContainerRef}
            >
                <AnimatedMessages
                    messages={messages}
                    myRole="ADMIN"
                />
                <div ref={messagesEndRef} />
            </div>

            <form
                className="flex gap-2 mt-2"
                onSubmit={(e) => {
                    e.preventDefault();
                    sendMessage();
                }}
            >
                <input
                    type="text"
                    className="flex-1 border rounded p-2 focus:outline-none"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                />
                <button
                    type="submit"
                    className="px-4 rounded"
                    style={{
                        backgroundColor: "var(--color-chat-send-bg)",
                        color: "var(--color-chat-send-text)",
                    }}
                >
                    전송
                </button>
            </form>
        </div>
    );
}