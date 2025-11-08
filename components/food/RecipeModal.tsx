"use client";

import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { RecipeItem } from "@/lib/types";
import { sendAccessEvent } from "@/lib/accesslog/accessEventApi";

interface RecipeModalProps {
    item: RecipeItem;
    onClose: () => void;
    clientId: string;
}

export default function RecipeModal({ item, onClose, clientId }: RecipeModalProps) {
    const hasSentLog = useRef(false);

    useEffect(() => {
        if (!hasSentLog.current) {
            sendAccessEvent(clientId ?? "anonymous", item.id);
            hasSentLog.current = true;
        }
    }, [clientId, item.id]);

    return (
        <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="bg-white p-3 rounded-2xl relative shadow-2xl flex flex-row gap-7 max-w-[540px] w-full"
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
            >
                {/* 왼쪽: 이미지 */}
                {item.image && (
                    <div className="flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden w-60 h-60">
                        <img
                            src={item.image}
                            alt={item.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                {/* 오른쪽: 텍스트 */}
                <div className="flex-1 flex flex-col justify-start text-left mt-1">
                    <h2 className={`font-bold mb-2 text-black text-xl`}>
                        {item.title}
                    </h2>
                    {item.cookTime && (
                        <p className="text-sm text-gray-600 mb-3">⏱️ {item.cookTime}</p>
                    )}
                    {item.ingredients && (
                        <div className="mb-4">
                            <p className="text-sm font-semibold mb-1 text-black">재료</p>
                            <p className="text-sm text-gray-700">{item.ingredients}</p>
                        </div>
                    )}
                    {item.steps && (
                        <div>
                            <p className="text-sm font-semibold mb-1 text-black">초간단 레시피</p>
                            <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                                {item.steps.map((step, idx) => (
                                    <li key={idx}>{step}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}