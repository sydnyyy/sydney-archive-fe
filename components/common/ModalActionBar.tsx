"use client";

import Image from "next/image";
import LikeButton from "./LikeButton";
import { useGuestAuthStore } from "@/store/useGuestAuthStore";

interface ModalActionBarProps {
    itemId: string;
    likedSet: Set<string>;
    setLikedSet: React.Dispatch<React.SetStateAction<Set<string>>>;
    onShare?: () => void;
}

export default function ModalActionBar({
                                           itemId,
                                           likedSet, setLikedSet,
                                           onShare,
                                       }: ModalActionBarProps) {

    const { sid } = useGuestAuthStore();

    return (
        <div
            className="flex gap-2 backdrop-blur-sm px-2 py-1.5 rounded-tr-xl"
            style={{ backgroundColor: "var(--color-bg-modal)" }}
        >
            <div className="w-8 h-8 flex items-center justify-center">
                <LikeButton
                    sid={sid}
                    itemId={itemId}
                    likedSet={likedSet}
                    setLikedSet={setLikedSet}
                />
            </div>

            {onShare && (
                <button onClick={onShare} className="w-8 h-8 flex items-center justify-center">
                    <Image src="/tabs/icon-share.svg" alt="공유" width={24} height={24} />
                </button>
            )}
        </div>
    );
}
