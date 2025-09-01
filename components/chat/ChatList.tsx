"use client";
import { AnimatePresence, motion } from "framer-motion";
import { ChatMessage } from "@/types/chat";

interface ChatListProps {
    messages: ChatMessage[];
    clientId: string | null;
    messagesEndRef: React.RefObject<HTMLDivElement | null>;
    onOptionClick?: (value: "yes" | "no") => void;
    formatKST: (iso: string) => string;
}

export default function ChatList({ messages, clientId, messagesEndRef, onOptionClick, formatKST }: ChatListProps) {
    return (
        <div
            style={{
                flex: 1,
                overflowY: "auto",
                padding: "14px",
                display: "flex",
                flexDirection: "column",
                gap: "10px" }}
        >
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

            <AnimatePresence initial={false}>
                {messages.map((msg, index) =>
                    msg.type === "SYSTEM" ? (
                        <motion.div
                            key={index}
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
                            onAnimationComplete={() => {
                                messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
                            }}
                        >
                            {msg.content}

                            {msg.options?.length && onOptionClick && (
                                <div
                                    style={{
                                        marginTop: "8px",
                                        display: "flex",
                                        justifyContent: "center",
                                        gap: "6px" }}
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
                            key={index}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            // exit={{ opacity: 0, y: -20 }}
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
                            onAnimationComplete={() => {
                                messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
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

            <div ref={messagesEndRef} />
        </div>
    );
}