"use client";

import { useEffect, useRef } from "react";
import { sendAccessEvent } from "@/lib/api/accesslog/accessEventApi";
import ModalLayout from "@/components/common/ModalLayout";
import ModalActionBar from "@/components/guest/item/ModalActionBar";
import ImageCarousel from "@/components/common/ImageCarousel";
import BookModalContent from "@/components/guest/item/BookModalContent";
import { useGuestAuthStore } from "@/store/useGuestAuthStore";
import { Item } from "@/types/domain/item/item";

interface ItemModalProps {
    item: Item;
    onClose: () => void;
    likedSet: Set<string>;
    setLikedSet: React.Dispatch<React.SetStateAction<Set<string>>>;
    onShare?: () => void;
}

export default function ItemModal({
                                       item,
                                       onClose,
                                       likedSet,
                                       setLikedSet,
                                       onShare
}: ItemModalProps) {

    if (!item) return null;

    const { sid } = useGuestAuthStore();
    const hasSentLog = useRef(false);

    useEffect(() => {
        if (!item) return;
        if (!hasSentLog.current && sid) {
            sendAccessEvent(sid, item.itemId);
            hasSentLog.current = true;
        }
    }, [item.itemId]);

    return (
        <ModalLayout onClose={onClose}>
            <div className="flex flex-col gap-1.5 w-full">

                <div className="flex items-center justify-between px-1.5 pt-2 gap-2">
                    <div className="flex items-center gap-2">
                        {item.itemType === "BOOK" && <BookModalContent item={item} />}
                    </div>
                </div>

                {/* 설명 텍스트 */}
                {item.description && (
                    <div
                        className="px-1.5 pt-2 text-sm whitespace-pre-line"
                        style={{ color: "var(--color-text-primary)" }}>
                        {item.description}
                    </div>
                )}

                {/* 이미지 슬라이더 */}
                {item.imageUrls && (
                    <ImageCarousel
                        images={item.imageUrls}
                        thumbnailIndex={item.thumbnailIndex}
                    />
                )}

                {/* 액션바 */}
                <div className="flex">
                    <ModalActionBar
                        itemId={item.itemId}
                        likedSet={likedSet}
                        setLikedSet={setLikedSet}
                        onShare={onShare}
                    />
                </div>

                {/* 상품 정보 목록 */}
                {/*<div className="flex flex-col w-full px-1.5 space-y-1">*/}
                {/*    {item.products && item.products.map((p: any, idx: number) => (*/}
                {/*        <a*/}
                {/*            key={idx}*/}
                {/*            href={p.link}*/}
                {/*            target="_blank"*/}
                {/*            rel="noopener noreferrer"*/}
                {/*            className="link-item flex flex-col px-1.5 py-2.5 md:text-base text-sm"*/}
                {/*        >*/}
                {/*            <div className="flex justify-between items-center">*/}
                {/*                <span className="font-medium">{p.name}</span>*/}
                {/*                {p.price &&*/}
                {/*                    <span*/}
                {/*                        style={{ color: "var(--color-text-secondary)" }}*/}
                {/*                    >{p.price}</span>}*/}
                {/*            </div>*/}

                {/*            {p.description && (*/}
                {/*                <span*/}
                {/*                    className="text-xs mt-0.5"*/}
                {/*                    style={{ color: "var(--color-text-tertiary)" }}*/}
                {/*                >{p.description}</span>*/}
                {/*            )}*/}
                {/*        </a>*/}
                {/*    ))}*/}
                {/*</div>*/}
            </div>
        </ModalLayout>
    );
}
