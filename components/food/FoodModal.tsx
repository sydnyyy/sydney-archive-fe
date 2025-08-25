"use client";

import { motion } from "framer-motion";
import { Item } from "@/lib/types";
import { FOOD_FORMAT } from "@/lib/types";

interface FoodModalProps {
    selectedItem: Item;
    onClose: () => void;
}

export default function FoodModal({ selectedItem, onClose }: FoodModalProps) {
    return (
        <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className={`
                bg-white p-3 rounded-2xl relative shadow-2xl flex flex-row gap-7
                 ${"format" in selectedItem && selectedItem.format === FOOD_FORMAT.RESTAURANT
                    ? "w-[80%] max-w-sm" : "w-[90%] max-w-xl"}
                 `}
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
            >
                {/* 왼쪽: 이미지 */}
                {selectedItem.image && (
                    <div
                        className={`
                        flex-shrink-0 bg-gray-100 rounded-xl overflow-hidden
                        ${"format" in selectedItem && selectedItem.format === FOOD_FORMAT.RESTAURANT
                            ? "w-40 h-40" 
                            : "w-60 h-60"}
                        `}
                    >
                        <img
                            src={selectedItem.image}
                            alt={selectedItem.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                {/* 오른쪽: 텍스트 */}
                <div className="flex-1 flex flex-col justify-start text-left mt-1">
                    <h2
                        className={`font-bold mb-2 text-black ${
                            "format" in selectedItem && selectedItem.format === FOOD_FORMAT.RESTAURANT
                                ? "text-lg"
                                : "text-xl"
                        }`}
                    >
                        {selectedItem.title}
                    </h2>

                    {/* 음식점 */}
                    {"format" in selectedItem && selectedItem.format === FOOD_FORMAT.RESTAURANT && (
                        <>
                            {"description" in selectedItem && (
                                <p className="text-sm text-gray-700 mb-2">{selectedItem.description}</p>
                            )}
                            {"location" in selectedItem && (
                                <p className="text-sm text-gray-600 mb-3">
                                    📍{" "}
                                    {selectedItem.link ? (
                                        <a
                                            href={selectedItem.link}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-800 hover:underline"
                                        >
                                            {selectedItem.location}
                                        </a>
                                    ) : (
                                        selectedItem.location
                                    )}
                                </p>
                            )}
                        </>
                    )}

                    {/* 레시피 */}
                    {"format" in selectedItem && selectedItem.format === FOOD_FORMAT.RECIPE && (
                        <>
                            {"cookTime" in selectedItem && (
                                <p className="text-sm text-gray-600 mb-3">⏱️ {selectedItem.cookTime}</p>
                            )}
                            {"ingredients" in selectedItem && (
                                <div className="mb-3">
                                    <p className="text-sm font-semibold mb-1 text-black">재료</p>
                                    <p className="text-sm text-gray-700">{selectedItem.ingredients}</p>
                                </div>
                            )}
                            {"steps" in selectedItem && selectedItem.steps && (
                                <div>
                                    <p className="text-sm font-semibold mb-1 text-black">초간단 레시피</p>
                                    <ul className="list-disc list-inside text-sm text-gray-700 space-y-1">
                                        {selectedItem.steps.map((step, idx) => (
                                            <li key={idx}>{step}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}
                        </>
                    )}
                </div>
            </motion.div>
        </motion.div>
    );
}