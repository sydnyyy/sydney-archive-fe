"use client";

import { useState } from "react";
import Image from "next/image";
import { addLikeApi, deleteLikeApi } from "@/lib/like/likeApi";

interface LikeButtonProps {
    clientId: string;
    itemId: string;
    likeMap: Record<string, boolean>;
    setLikeMap: React.Dispatch<React.SetStateAction<Record<string, boolean>>>;
}

export default function LikeButton({
                                       clientId,
                                       itemId,
                                       likeMap, setLikeMap }: LikeButtonProps) {

    const liked = likeMap[itemId] ?? false;
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        if (loading) return;
        setLoading(true);

        try {
            if (liked) await deleteLikeApi(clientId, itemId);
            else await addLikeApi(clientId, itemId);

            setLikeMap(prev => ({ ...prev, [itemId]: !liked }));
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div onClick={handleClick} style={{ cursor: "pointer" }}>
            <Image
                src={liked ? "/tabs/icon-heart-filled.svg" : "/tabs/icon-heart-outline-light.svg"}
                alt="좋아요"
                width={24}
                height={24}
            />
        </div>
    );
}
