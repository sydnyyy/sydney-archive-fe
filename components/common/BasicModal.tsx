"use client";

import { useEffect, useRef } from "react";
import { sendAccessEvent } from "@/lib/accesslog/accessEventApi";
import ModalLayout from "@/components/common/ModalLayout";
import ModalActionBar from "@/components/common/ModalActionBar";
import { Item } from "@/lib/types/item/item";
import ImageCarousel from "@/components/common/ImageCarousel";

interface BasicModalProps {
    item: Item
    onClose: () => void;
    clientId: string;
    likedSet: Set<string>;
    setLikedSet: React.Dispatch<React.SetStateAction<Set<string>>>;
    onChat: () => void;
    onShare?: () => void;
}

export default function BasicModal({
                                         item,
                                         onClose,
                                         clientId,
                                         likedSet, setLikedSet,
                                         onChat,
                                         onShare }: BasicModalProps) {

    if (!item) return null;

    const hasSentLog = useRef(false);

    useEffect(() => {
        if (!item) return;
        if (!hasSentLog.current) {
            sendAccessEvent(clientId ?? "anonymous", item.id);
            hasSentLog.current = true;
        }
    }, [clientId, item.id]);

    return (
        <ModalLayout onClose={onClose}>
            <div className="flex flex-col gap-1.5 w-full">

                {/* 설명 텍스트 */}
                {item.description && (
                    <div
                        className="px-1.5 pt-2 text-sm whitespace-pre-line"
                        style={{ color: "var(--color-text-primary)" }}>
                        {item.description}
                    </div>
                )}

                {/* 이미지 슬라이더 */}
                {item.images && (
                    <ImageCarousel
                        images={item.images}
                        thumbnailIndex={item.thumbnailIndex}
                    />
                )}

                {/* 액션바 */}
                <div className="flex">
                    <ModalActionBar
                        clientId={clientId}
                        itemId={item.id}
                        likedSet={likedSet}
                        setLikedSet={setLikedSet}
                        onChat={onChat}
                        onShare={onShare}
                    />
                </div>

                {/* 상품 정보 목록 */}
                <div className="flex flex-col w-full px-1.5 space-y-1">
                    {item.products && item.products.map((p: any, idx: number) => (
                        <a
                            key={idx}
                            href={p.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="link-item flex flex-col px-1.5 py-2.5 md:text-base text-sm"
                        >
                            <div className="flex justify-between items-center">
                                <span className="font-medium">{p.name}</span>
                                {p.price &&
                                    <span
                                        style={{ color: "var(--color-text-secondary)" }}
                                    >{p.price}</span>}
                            </div>

                            {p.description && (
                                <span
                                    className="text-xs mt-0.5"
                                    style={{ color: "var(--color-text-tertiary)" }}
                                >{p.description}</span>
                            )}
                        </a>
                    ))}
                </div>
            </div>
        </ModalLayout>
    );
}
