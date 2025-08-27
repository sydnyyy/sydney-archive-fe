export interface ChatMessage {
    sender: string;
    receiver: string;
    content: string;
    sendAt: string;
    type: "USER" | "ADMIN" | "SYSTEM";
}

export interface ChatRoom {
    clientId: string;
}