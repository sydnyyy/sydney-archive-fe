export const CHAT_TYPE = {
    USER: "USER",
    ADMIN: "ADMIN",
    SYSTEM: "SYSTEM",
} as const;

export type ChatType = typeof CHAT_TYPE[keyof typeof CHAT_TYPE];

export interface ChatMessageRequest {
    senderUserId: string;
    receiverUserId: string;
    content: string;
    type: ChatType;
}

export interface ChatMessage {
    id: string;
    chatRoomId: string;
    senderUserId: string;
    receiverUserId: string;
    content: string;
    createdAt: string;
    type: ChatType;
}

export interface AdminChatRoom {
    chatRoomId: string;
    lastMessageAt: string;
}