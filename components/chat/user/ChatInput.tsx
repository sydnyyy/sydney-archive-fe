"use client";

import React from "react";

interface ChatInputProps {
    inputMessage: string;
    onChange: React.Dispatch<React.SetStateAction<string>>;
    onSend: () => void;
}

export default function ChatInput({ inputMessage, onChange, onSend }: ChatInputProps) {
    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                onSend();
            }}
            style={{
                display: "flex",
                padding: "10px",
                borderTop: "1px solid var(--color-chat-border)",
            }}
        >
            <input
                type="text"
                value={inputMessage}
                onChange={(e) => onChange(e.target.value)}
                className="chat-input-placeholder focus:outline-none"
                style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "20px",
                    border: "1px solid var(--color-chat-border)",
                }}
                placeholder="메시지 입력..."
            />
            <button
                type="submit"
                style={{
                    marginLeft: "10px",
                    padding: "10px 15px",
                    borderRadius: "20px",
                    border: "none",
                    backgroundColor: "var(--color-chat-send-bg)",
                    color: "var(--color-chat-send-text)",
                    cursor: "pointer",
                }}
            >
                전송
            </button>
        </form>
    );
}