"use client";

import { useEffect, useRef } from "react";
import { RecipeItem } from "@/lib/types";
import { sendAccessEvent } from "@/lib/accesslog/accessEventApi";
import ModalLayout from "@/components/common/ModalLayout";

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
        <ModalLayout onClose={onClose}>
            {/* 왼쪽: 이미지 */}
            {item.image && (
                <div className="w-full h-[200px] sm:h-[240px] overflow-hidden rounded-xl">
                    <img
                        src={item.image}
                        alt={item.title}
                        className="w-full h-full object-cover object-center"
                    />
                </div>
            )}

            {/* 오른쪽: 텍스트 */}
            <div className="flex-1 flex flex-col justify-start text-left mt-3 mb-2 ml-2">
                <h2 className="font-bold mb-2 text-black text-xl">{item.title}</h2>
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
        </ModalLayout>
    );
}