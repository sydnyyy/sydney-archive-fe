"use client";

import Image from "next/image";
import LikeButton from "./LikeButton";

interface ModalActionBarProps {
    clientId: string;
    itemId: string;
    likedSet: Set<string>;
    setLikedSet: React.Dispatch<React.SetStateAction<Set<string>>>;
    onChat: () => void;
    onShare?: () => void;
}

export default function ModalActionBar({
                                           clientId,
                                           itemId,
                                           likedSet, setLikedSet,
                                           onChat,
                                           onShare,
                                       }: ModalActionBarProps) {

    return (
        <div className="flex gap-2 bg-[#EDF2EF] backdrop-blur-sm px-2 py-1.5 rounded-tr-xl">
            <div className="w-8 h-8 flex items-center justify-center">
                <LikeButton
                    clientId={clientId}
                    itemId={itemId}
                    likedSet={likedSet}
                    setLikedSet={setLikedSet}
                />
            </div>
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
