"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChatMessage } from "@/types/chat";
import { RefObject, useState } from "react";

interface ChatListProps {
    messages: ChatMessage[];
    clientId: string | null;
    messagesEndRef: RefObject<HTMLDivElement | null>;
    containerRef: RefObject<HTMLDivElement | null>;
    onOptionClick?: (value: "yes" | "no") => void;
    formatKST: (iso: string) => string;
    onLoadPrevious: () => Promise<ChatMessage[]>;
    showTopNotice: boolean;
    setShowTopNotice: (show: boolean) => void;
}

export default function ChatList({
                                     messages = [],
                                     clientId,
                                     messagesEndRef,
                                     containerRef,
                                     onOptionClick,
                                     formatKST,
                                     onLoadPrevious,
                                     showTopNotice,
                                     setShowTopNotice,
                                 }: ChatListProps) {
    const [isLoading, setIsLoading] = useState(false);

    const handleScroll = async () => {
        if (!containerRef.current || isLoading) return;

        if (containerRef.current.scrollTop === 0) {
            setIsLoading(true);
            try {
                const prevHeight = containerRef.current.scrollHeight;
                const loaded = await onLoadPrevious();
                if (loaded.length > 0 && containerRef.current) {
                    const newHeight = containerRef.current.scrollHeight;
                    containerRef.current.scrollTop = newHeight - prevHeight;
                }
                if (containerRef.current.scrollTop === 0) {
                    setShowTopNotice(true);
                }
            } finally {
                setIsLoading(false);
            }
        } else {
            setShowTopNotice(false);
        }
    };

    return (
        <div
            ref={containerRef}
            style={{
                flex: 1,
                overflowY: "auto",
                padding: "14px",
                display: "flex",
                flexDirection: "column",
                gap: "10px"
            }}
            onScroll={handleScroll}
        >
            {showTopNotice && (
                <div
                    style={{
                        paddingBottom: "14px",
                        textAlign: "center",
                        color: "#6c757d",
                        fontSize: "14px",
                        borderBottom: "1px solid #eee",
                    }}
                >
                    궁금한 점이 있으신가요? 문의하실 내용을 남겨주세요!<br />
                    아이템을 클릭하면 아이템에 대한 상담을 시작합니다 🤗
                </div>
            )}

            <AnimatePresence initial={false} mode={isLoading ? "wait" : undefined}>
                {messages.map((msg) =>
                    msg.type === "SYSTEM" ? (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={{ duration: 0.3 }}
                            style={{
                                textAlign: "center",
                                fontSize: "14px",
                                padding: "8px 12px",
                                backgroundColor: "#EAF4FF",
                                color: "#4599E6",
                                borderRadius: "12px",
                                margin: "4px auto",
                                maxWidth: "85%",
                                fontWeight: 500,
                            }}
                        >
                            {msg.content}
                            {msg.options?.length && onOptionClick && (
                                <div
                                    style={{
                                        marginTop: "8px",
                                        display: "flex",
                                        justifyContent: "center",
                                        gap: "6px"
                                    }}
                                >
                                    {msg.options.map((opt) => (
                                        <button
                                            key={opt.value}
                                            onClick={() => onOptionClick(opt.value as "yes" | "no")}
                                            style={{
                                                padding: "6px 12px",
                                                borderRadius: "12px",
                                                border: "1px solid #4599E6",
                                                backgroundColor: "white",
                                                color: "#4599E6",
                                                cursor: "pointer",
                                            }}
                                        >
                                            {opt.label}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </motion.div>
                    ) : (
                        <motion.div
                            key={msg.id}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3 }}
                            style={{
                                display: "flex",
                                alignItems: "flex-end",
                                justifyContent: msg.sender === clientId ? "flex-end" : "flex-start",
                                gap: "4px",
                                maxWidth: "80%",
                                marginLeft: msg.sender === clientId ? "auto" : undefined,
                                marginRight: msg.sender === clientId ? undefined : "auto",
                            }}
                        >
                            {msg.sender === clientId && (
                                <span style={{ fontSize: "12px", color: "#6c757d" }}>
                                    {formatKST(msg.sendAt).slice(13, 19)}
                                </span>
                            )}
                            <div
                                style={{
                                    padding: "8px 12px",
                                    borderRadius: "15px",
                                    wordWrap: "break-word",
                                    backgroundColor: msg.sender === clientId ? "#4599E6" : "#e6ebed",
                                    color: msg.sender === clientId ? "white" : "black",
                                }}
                            >
                                {msg.content}
                            </div>
                            {msg.sender !== clientId && (
                                <span style={{ fontSize: "12px", color: "#6c757d" }}>
                                    {formatKST(msg.sendAt).slice(13, 19)}
                                </span>
                            )}
                        </motion.div>
                    )
                )}
            </AnimatePresence>

            {isLoading && (
                <div
                    style={{
                        textAlign: "center",
                        fontSize: "12px",
                        color: "#6c757d",
                        padding: "4px"
                    }}
                >
                    이전 메시지를 불러오는 중...
                </div>
            )}

            <div ref={messagesEndRef} />
        </div>
    );
}