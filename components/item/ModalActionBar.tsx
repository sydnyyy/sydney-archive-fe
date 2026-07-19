"use client";

import { ShareIcon } from "@heroicons/react/24/outline";
import LikeButton from "./LikeButton";
import { useAuthStore } from "@/store/useAuthStore";

interface ModalActionBarProps {
    itemId: string;
    likedSet: Set<string>;
    setLikedSet: React.Dispatch<React.SetStateAction<Set<string>>>;
    onShare: () => void;
}

export default function ModalActionBar({
                                           itemId,
                                           likedSet, setLikedSet,
                                           onShare,
                                       }: ModalActionBarProps) {

    const { sid } = useAuthStore();

    return (
        <div
            className="flex w-full gap-1.5 backdrop-blur-sm px-2 py-1.5"
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

            <button
                onClick={onShare}
                className="ml-auto w-7 h-7 flex items-center justify-center"
            >
                <ShareIcon />
            </button>
        </div>
    );
}
