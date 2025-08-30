export interface ChatMessage {
    id: string;
    sender: string;
    receiver: string;
    content: string;
    sendAt: string;
    type: "USER" | "ADMIN" | "SYSTEM";
    options?: { label: string; value: string }[];
}

export interface ChatRoom {
    clientId: string;
}