"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { sendAccessEvent } from "@/lib/accesslog/accessEventApi";
import ModalLayout from "@/components/common/ModalLayout";
import ModalActionBar from "@/components/common/ModalActionBar";
import { BaseItem } from "@/lib/types/item.types";

interface BasicModalProps {
    item: BaseItem
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

                {/* 이미지 + 태그 */}
                <div className="pt-2 px-1.5 flex gap-2 overflow-x-auto hide-scrollbar">
                    {item.images?.map((src, idx) => (
                        <img
                            key={idx}
                            src={src}
                            alt={`상품 이미지 ${idx + 1}`}
                            className="max-w-full max-h-[250px] object-contain rounded-2xl"
                        />
                    ))}

                {/*    {item.tags && item.tags.map((tag: any, idx: number) => (*/}
                {/*        <motion.a*/}
                {/*            key={idx}*/}
                {/*            className="absolute tag flex flex-col items-center"*/}
                {/*            href={tag.link}*/}
                {/*            target="_blank"*/}
                {/*            rel="noopener noreferrer"*/}
                {/*            style={{ left: tag.x, top: tag.y }}*/}
                {/*            animate={{ y: [0, -3, 0], rotate: [0, 2, -2, 0] }}*/}
                {/*            transition={{*/}
                {/*                duration: 4.5,*/}
                {/*                repeat: Infinity,*/}
                {/*                repeatType: "mirror",*/}
                {/*                ease: "easeInOut",*/}
                {/*            }}*/}
                {/*        >*/}
                {/*            <img*/}
                {/*                src={tag.icon}*/}
                {/*                alt="tag"*/}
                {/*                className="w-17 h-17 object-contain"*/}
                {/*            />*/}
                {/*            <span*/}
                {/*                className="absolute text-xs px-2 py-0.5 rounded whitespace-nowrap"*/}
                {/*                style={{*/}
                {/*                    left: tag.labelX || "100%",*/}
                {/*                    top: tag.labelY || "0",*/}
                {/*                    backgroundColor: tag.bgColor || "rgba(255,255,255,0.7)",*/}
                {/*                    color: tag.color || "black",*/}
                {/*                }}*/}
                {/*            >*/}
                {/*            {tag.label}*/}
                {/*        </span>*/}
                {/*        </motion.a>*/}
                {/*    ))}*/}
                </div>

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
