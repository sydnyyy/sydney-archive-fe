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
            <div className="bg-white rounded-xl w-[600px] max-h-[80vh] flex flex-col overflow-hidden">
                <div className="flex justify-between items-center p-3 border-b">
                    <h3 className="font-bold">👤 {clientId} 채팅</h3>
                    <button
                        onClick={onClose}
                        className="text-gray-500 hover:text-gray-700"
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
