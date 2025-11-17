"use client";

import { useEffect, useRef } from "react";
import { RecipeItem } from "@/lib/types";
import { sendAccessEvent } from "@/lib/accesslog/accessEventApi";
import ModalLayout from "@/components/common/ModalLayout";
import ModalActionBar, { ActionBarHandlers } from "@/components/common/ModalActionBar";

interface RecipeModalProps {
    item: RecipeItem;
    onClose: () => void;
    clientId: string;
    actionBarHandlers: ActionBarHandlers;
}

export default function RecipeModal({
                                        item,
                                        onClose,
                                        clientId,
                                        actionBarHandlers }: RecipeModalProps) {

    if (!item) return null;

    const hasSentLog = useRef(false);

    useEffect(() => {
        if (!hasSentLog.current) {
            sendAccessEvent(clientId ?? "anonymous", item.id);
            hasSentLog.current = true;
        }
    }, [clientId, item.id]);

    return (
        <ModalLayout onClose={onClose}>
            <div className="flex flex-col gap-1.5 w-full">
                {/* 이미지 + 액션바 */}
                <div className="relative w-full">
                    <div className="absolute bottom-0 left-0 z-20">
                        <ModalActionBar {...actionBarHandlers} />
                    </div>

                    <img
                        src={item.image}
                        alt="상품 이미지"
                        className="w-full h-[200px] sm:h-[240px] object-cover rounded-2xl"
                    />
                </div>

                {/* 텍스트 */}
                <div className="flex-1 flex flex-col justify-start text-left mt-2 mb-2 ml-2">
                    <h2 className="font-bold mb-2 text-black text-xl">{item.title}</h2>
                    {item.cookTime && (
                        <p className="text-sm text-gray-600 mb-2">⏱️ {item.cookTime}</p>
                    )}
                    {item.ingredients && (
                        <div className="mb-2">
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
        </div>
        </ModalLayout>
    );
}