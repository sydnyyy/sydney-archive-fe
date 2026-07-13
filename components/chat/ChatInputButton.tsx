"use client";

import React from "react";
import {PaperAirplaneIcon} from "@heroicons/react/24/outline";

interface ChatInputProps {
    inputMessage: string;
    onChange: React.Dispatch<React.SetStateAction<string>>;
    onSend: () => void;
}

export default function ChatInputButton({ inputMessage, onChange, onSend }: ChatInputProps) {
    return (
        <form
            className="flex gap-4"
            onSubmit={(e) => {
                e.preventDefault();
                onSend();
            }}
        >
            <input
                type="text"
                className="flex-1 border rounded p-2 focus:outline-none"
                value={inputMessage}
                onChange={(e) => onChange(e.target.value)}
                placeholder="메시지를 입력하세요."
            />
            <button type="submit">
                <PaperAirplaneIcon className="h-6 w-6"/>
            </button>
        </form>
    );
}