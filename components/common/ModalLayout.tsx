"use client";

import { ReactNode } from "react";
import { motion } from "framer-motion";

interface ModalLayoutProps {
    children: ReactNode;
    onClose: () => void;
    widthClass?: string;
    heightClass?: string;
    scrollable?: boolean;
}

export default function ModalLayout({
                                        children,
                                        onClose,
                                        widthClass = "max-w-[440px]",
                                        heightClass = "max-h-[60%]",
                                        scrollable = true,
                                    }: ModalLayoutProps) {

    return (
        <div
            className="fixed inset-0 flex justify-center items-center z-50"
            style={{ backgroundColor: "var(--color-overlay)" }}
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className={`
                    rounded-xl p-1
                    ${widthClass} ${heightClass}
                    ${scrollable ? "overflow-auto hide-scrollbar" : "overflow-hidden"}
                `}
                style={{ backgroundColor: "var(--color-bg-modal)" }}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </motion.div>
        </div>
    );
}
