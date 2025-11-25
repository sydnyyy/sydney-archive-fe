"use client";

import { ChatMessage } from "@/types/chat";
import AdminChatView from "./AdminChatView";

interface Props {
    clientId: string;
    adminId: string;
    stompClient: any;
    messages: ChatMessage[];
    setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
    onClose: () => void;
}

export default function ChatModal({
                                      clientId,
                                      adminId,
                                      stompClient,
                                      messages,
                                      setMessages,
                                      onClose }: Props) {
    return (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
            <div
                className="rounded-xl w-[600px] max-h-[80vh] flex flex-col overflow-hidden"
                style={{
                    backgroundColor: "var(--color-chat-bg)",
                    border: "1px solid var(--color-admin-chat-border)",
                }}
            >
                <div
                    className="flex justify-between items-center p-3 border-b"
                    style={{ borderColor: "var(--color-border-tab)" }}
                >
                    <h3 className="font-bold">👤 {clientId} 채팅</h3>
                    <button
                        onClick={onClose}
                        style={{
                            color: "var(--color-chat-close-text)",
                        }}
                        onMouseEnter={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.color =
                                "var(--color-chat-close-text-hover)";
                        }}
                        onMouseLeave={(e) => {
                            (e.currentTarget as HTMLButtonElement).style.color =
                                "var(--color-chat-close-text)";
                        }}
                    >
                        닫기
                    </button>
                </div>

                <AdminChatView
                    clientId={clientId}
                    adminId={adminId}
                    stompClient={stompClient}
                    messages={messages}
                    setMessages={setMessages}
                />
            </div>
        </div>
    );
}
