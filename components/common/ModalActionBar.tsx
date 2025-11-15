"use client";

import Image from "next/image";

export interface ActionBarHandlers {
    onLike: () => void;
    onChat: () => void;
    onShare?: () => void;
}

export default function ModalActionBar({ onLike, onChat, onShare }: ActionBarHandlers) {
    return (
        <div className="flex gap-2 bg-[#EDF2EF] backdrop-blur-sm px-2 py-1.5 rounded-tr-xl">
            <button onClick={onLike} className="w-8 h-8 flex items-center justify-center">
                <Image src="/tabs/icon-heart-outline-light.svg" alt="좋아요" width={24} height={24} />
            </button>
            <button onClick={onChat} className="w-8 h-8 flex items-center justify-center">
                <Image src="/tabs/icon-chat-light.svg" alt="채팅" width={24} height={24} />
            </button>
            {onShare && (
                <button onClick={onShare} className="w-8 h-8 flex items-center justify-center">
                    <Image src="/tabs/icon-share.svg" alt="공유" width={24} height={24} />
                </button>
            )}
        </div>
    );
}
