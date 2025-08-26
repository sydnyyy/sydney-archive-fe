export interface ChatMessage {
    sender: string;
    receiver: string;
    content: string;
    sendAt: string;
    type: "USER" | "ADMIN" | "SYSTEM";
}