"use client";

import { ReactNode, useState, useEffect } from "react";
import { motion } from "framer-motion";

interface ModalLayoutProps {
    children: ReactNode;
    onClose: () => void;
    widthClass?: string;
    heightClass?: string;
}

export default function ModalLayout({
                                        children,
                                        onClose,
                                        heightClass = "max-h-[60%]",
                                    }: ModalLayoutProps) {

    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const userAgent = navigator.userAgent.toLowerCase();
        const mobile =
            /iphone|ipad|ipod|android|webos|blackberry|windows phone/.test(userAgent);
        setIsMobile(mobile);
    }, []);

    const widthClass = isMobile ? "w-[330px]" : "w-[440px]";

    return (
        <div
            className="fixed inset-0 flex justify-center items-center z-50 bg-black/50"
            onClick={onClose}
        >
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.18, ease: "easeOut" }}
                className={`bg-[#EDF2EF] rounded-2xl shadow-lg 
                            overflow-auto ${widthClass} ${heightClass} p-1.5`}
                onClick={(e) => e.stopPropagation()}
            >
                {children}
            </motion.div>
        </div>
    );
}
