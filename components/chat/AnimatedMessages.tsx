"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChatMessage } from "@/types/chat";

interface AnimatedMessagesProps {
    messages: ChatMessage[];
    clientId: string | null;
    onOptionClick?: (value: "yes" | "no") => void;
    formatKST: (iso: string) => string;
    isLoading: boolean;
}

export default function AnimatedMessages({
                                             messages,
                                             clientId,
                                             onOptionClick,
                                             formatKST,
                                             isLoading,
                                         }: AnimatedMessagesProps) {
    return (
        <AnimatePresence initial={false} mode={isLoading ? "wait" : undefined}>
            {messages.map((msg) => {
                switch (msg.type) {
                    case "SYSTEM":
                        return (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.3 }}
                                className="text-center text-[14px] px-3 py-2 rounded-[12px] mx-auto my-1 max-w-[85%] font-medium bg-[#EDFAF3] text-[#6CA67C]"
                            >
                                {msg.content}
                                {msg.options?.length && onOptionClick && (
                                    <div className="mt-2 flex justify-center gap-1.5">
                                        {msg.options.map((opt) => (
                                            <button
                                                key={opt.value}
                                                onClick={() => onOptionClick(opt.value as "yes" | "no")}
                                                className="px-3 py-1.5 rounded-[12px] border bg-white text-[#6CA67C] cursor-pointer"
                                            >
                                                {opt.label}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </motion.div>
                        );

                    case "USER":
                        return (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="flex items-end gap-1 max-w-[80%] ml-auto justify-end"
                            >
                                <span className="text-[12px] text-[#6c757d]">
                                    {formatKST(msg.sendAt).slice(13, 19)}
                                </span>
                                <div className="px-3 py-2 rounded-[15px] break-words bg-[#6CA67C] text-white">
                                    {msg.content}
                                </div>
                            </motion.div>
                        )

                    case "ADMIN":
                        return (
                            <motion.div
                                key={msg.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.3 }}
                                className="flex items-end gap-1 max-w-[80%] mr-auto justify-start"
                            >
                                <div className="px-3 py-2 rounded-[15px] break-words bg-[#e6ebed] text-black">
                                    {msg.content}
                                </div>
                                <span className="text-[12px] text-[#6c757d]">
                                    {formatKST(msg.sendAt).slice(13, 19)}
                                </span>
                            </motion.div>
                        );

                    default:
                        return null;
                }
            })}
        </AnimatePresence>
    );
}