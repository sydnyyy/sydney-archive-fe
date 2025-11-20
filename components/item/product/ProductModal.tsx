"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { ProductItem } from "@/lib/types";
import { sendAccessEvent } from "@/lib/accesslog/accessEventApi";
import ModalLayout from "@/components/common/ModalLayout";
import ModalActionBar from "@/components/common/ModalActionBar";

interface ProductModalProps {
    item: ProductItem;
    onClose: () => void;
    clientId: string;
    likedSet: Set<string>;
    setLikedSet: React.Dispatch<React.SetStateAction<Set<string>>>;
    onChat: () => void;
    onShare?: () => void;
}

export default function ProductModal({
                                         item,
                                         onClose,
                                         clientId,
                                         likedSet, setLikedSet,
                                         onChat,
                                         onShare }: ProductModalProps) {

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
                {/* 이미지 + 태그 */}
                <div className="relative w-full">
                    <div className="absolute bottom-0 left-0 z-20">
                        <ModalActionBar
                            clientId={clientId}
                            itemId={item.id}
                            likedSet={likedSet}
                            setLikedSet={setLikedSet}
                            onChat={onChat}
                            onShare={onShare}
                        />
                    </div>

                    <img
                        src={item.image}
                        alt="상품 이미지"
                        className="w-full h-[220px] sm:h-[350px] object-cover rounded-2xl"
                    />

                    {item.tags && item.tags.map((tag: any, idx: number) => (
                        <motion.a
                            key={idx}
                            className="absolute tag flex flex-col items-center"
                            href={tag.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            style={{ left: tag.x, top: tag.y }}
                            animate={{ y: [0, -3, 0], rotate: [0, 2, -2, 0] }}
                            transition={{
                                duration: 4.5,
                                repeat: Infinity,
                                repeatType: "mirror",
                                ease: "easeInOut",
                            }}
                        >
                            <img
                                src={tag.icon}
                                alt="tag"
                                className="w-17 h-17 object-contain"
                            />
                            <span
                                className="absolute text-xs px-2 py-0.5 rounded whitespace-nowrap"
                                style={{
                                    left: tag.labelX || "100%",
                                    top: tag.labelY || "0",
                                    backgroundColor: tag.bgColor || "rgba(255,255,255,0.7)",
                                    color: tag.color || "black",
                                }}
                            >
                            {tag.label}
                        </span>
                        </motion.a>
                    ))}
                </div>

                {/* 상품 정보 목록 */}
                <div className="flex flex-col w-full px-1.5 space-y-1">
                    {item.products.map((p: any, idx: number) => (
                        <a
                            key={idx}
                            href={p.link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex flex-col px-1 py-2.5 md:text-base text-sm rounded-lg"
                        >
                            <div className="flex justify-between items-center">
                                <span className="font-medium">{p.name}</span>
                                {p.price && <span className="text-gray-600">{p.price}</span>}
                            </div>

                            {p.description && (
                                <span className="text-gray-500 text-xs mt-0.5">{p.description}</span>
                            )}
                        </a>
                    ))}
                </div>
            </div>
        </ModalLayout>
    );
}
