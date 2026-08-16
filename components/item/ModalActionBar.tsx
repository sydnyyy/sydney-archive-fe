"use client";

import { ShareIcon } from "@heroicons/react/24/outline";
import LikeButton from "./LikeButton";
import {useUserAuth} from "@/app/providers/user/AuthProvider";

interface ModalActionBarProps {
    itemId: string;
    likedSet: Set<string>;
    setLikedSet: React.Dispatch<React.SetStateAction<Set<string>>>;
    onShare: () => void;
}

export default function ModalActionBar({
                                           itemId,
                                           likedSet,
                                           setLikedSet,
                                           onShare,
                                       }: ModalActionBarProps) {

    const { accessToken, refreshAccessToken } = useUserAuth();

    return (
        <div
            className="flex w-full gap-1.5 backdrop-blur-sm px-2 py-1.5"
            style={{ backgroundColor: "var(--color-bg-modal)" }}
        >
            <div className="w-8 h-8 flex items-center justify-center">
                <LikeButton
                    itemId={itemId}
                    likedSet={likedSet}
                    setLikedSet={setLikedSet}
                    accessToken={accessToken}
                    refreshAccessToken={refreshAccessToken}
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
