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
                borderTop: "1px solid #eee",
            }}
        >
            <input
                type="text"
                value={inputMessage}
                onChange={(e) => onChange(e.target.value)}
                style={{
                    flex: 1,
                    padding: "10px",
                    borderRadius: "20px",
                    border: "1px solid #ccc",
                    color: "black",
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
                    backgroundColor: "#4599E6",
                    color: "white",
                    cursor: "pointer",
                }}
            >
                전송
            </button>
        </form>
    );
}