"use client";

import { ChatMessage } from "@/types/chat";
import { RefObject, useState } from "react";
import AnimatedMessages from "./AnimatedMessages";

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

            <AnimatedMessages
                messages={messages}
                clientId={clientId}
                onOptionClick={onOptionClick}
                formatKST={formatKST}
                isLoading={isLoading}
            />

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