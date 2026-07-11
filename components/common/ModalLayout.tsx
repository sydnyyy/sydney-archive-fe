"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import CloseButton from "@/components/common/button/CloseButton";

interface ModalLayoutProps {
    children: ReactNode;
    onClose?: () => void;
    widthClass?: string;
    heightClass?: string;
    scrollable?: boolean;
}

export default function ModalLayout({
                                        children,
                                        onClose,
                                        widthClass = "w-[440px]",
                                        heightClass = "max-h-[60%]",
                                        scrollable = true,
                                    }: ModalLayoutProps) {

    return (
        <div className="
                fixed inset-0 z-50
                flex justify-center items-center
                bg-black/30
            "
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className={`
                    ${widthClass} max-w-[95vw]
                    ${heightClass}
                   
                    flex flex-col
                    rounded-xl p-2 gap-2
                    bg-[var(--color-bg-modal)]
                         
                    ${scrollable ? "overflow-auto hide-scrollbar" : "overflow-hidden"}
                `}
                onClick={(e) => e.stopPropagation()}
            >

                {onClose && (
                    <header>
                        <div className="flex flex-col ml-1">
                            <CloseButton onClose={onClose} />
                        </div>
                    </header>
                )}

                <main className="flex-1 overflow-y-auto hide-scrollbar">
                    {children}
                </main>
            </motion.div>
        </div>
    );
}
