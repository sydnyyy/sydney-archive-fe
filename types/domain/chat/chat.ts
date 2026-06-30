export const CHAT_TYPE = {
    USER: "USER",
    ADMIN: "ADMIN",
    SYSTEM: "SYSTEM",
} as const;

export type ChatType = typeof CHAT_TYPE[keyof typeof CHAT_TYPE];

export interface ChatMessage {
    id?: string;
    senderSid: string;
    receiverSid: string;
    content: string;
    sendAt: string;
    type: ChatType;
    options?: { label: string; value: string }[];
}

export interface AdminChatRoom {
    userSid: string;
    lastMessageAt: string;
}