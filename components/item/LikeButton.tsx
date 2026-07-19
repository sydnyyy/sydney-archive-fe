"use client";

import { useState } from "react";
import Image from "next/image";
import { addLikeApi, deleteLikeApi } from "@/lib/api/user/like/likeApi";

interface LikeButtonProps {
    sid?: string | null;
    itemId: string;
    likedSet: Set<string>;
    setLikedSet: React.Dispatch<React.SetStateAction<Set<string>>>;
}

export default function LikeButton({
                                       sid,
                                       itemId,
                                       likedSet, setLikedSet }: LikeButtonProps) {

    const liked = likedSet.has(itemId) ?? false;
    const [loading, setLoading] = useState(false);

    const handleClick = async () => {
        if (loading) return;

        if (!sid) {
            alert("좋아요 기능에 일시적으로 문제가 발생했습니다.")
            return;
        }
        setLoading(true);

        try {
            if (liked) await deleteLikeApi(sid, itemId);
            else await addLikeApi(sid, itemId);

            setLikedSet(prev => {
                const next = new Set(prev);
                if (liked) {
                    next.delete(itemId);
                } else {
                    next.add(itemId);
                }
                return next;
            });
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
