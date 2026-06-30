"use client";

import { useRef, useLayoutEffect } from "react";
import { ChatMessage } from "@/types/domain/chat/chat";

export function useChatScroll(
    messages: ChatMessage[],
    isInitialLoadDone: boolean,
    loadPreviousMessages: () => Promise<ChatMessage[]>,
    onPrependMessages: (older: ChatMessage[]) => void,
    onNoMoreMessages?: () => void
) {

    const messagesContainerRef = useRef<HTMLDivElement | null>(null);
    const messagesEndRef = useRef<HTMLDivElement | null>(null);
    const isAtBottomRef = useRef(true);
    const hasInitialScrolledRef = useRef(false);
    const SCROLL_THRESHOLD = 100;

    const handleScroll = async () => {
        const container = messagesContainerRef.current;
        if (!container || !isInitialLoadDone) return;

        isAtBottomRef.current = container.scrollHeight - container.scrollTop - container.clientHeight < SCROLL_THRESHOLD;

        // 이전 메시지 로드
        if (container.scrollTop === 0) {
            const prevHeight = container.scrollHeight;
            const older = await loadPreviousMessages();
            if (!older || older.length === 0) {
                onNoMoreMessages?.();
                return;
            }

            onPrependMessages(older);

            requestAnimationFrame(() => {
                const newHeight = container.scrollHeight;
                container.scrollTop = newHeight - prevHeight;
            });
        }
    };

    // 새 메시지 수신 시 스크롤 제어
    useLayoutEffect(() => {
        if (!messagesContainerRef.current || !messagesEndRef.current) return;

        // 최초 로딩 시 즉시 하단 이동
        if (!hasInitialScrolledRef.current && isInitialLoadDone) {
            messagesEndRef.current.scrollIntoView({ behavior: "auto" });
            hasInitialScrolledRef.current = true;
            return;
        }

        if (isAtBottomRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages, isInitialLoadDone]);

    return { messagesContainerRef, messagesEndRef, handleScroll };
}
