import { motion } from "framer-motion";
import { ProductItem } from "@/lib/types";
import { sendAccessEvent } from "@/lib/accesslog/accessEventApi";
import { useEffect, useRef } from "react";

interface ProductModalProps {
    item: ProductItem;
    onClose: () => void;
    clientId: string;
}

function ProductDetailView({ image, tags, products }: any) {
    return (
        <div className="flex flex-col gap-2 w-full h-[450px]">

            {/* 이미지 + 태그 */}
            <div className="relative w-full">
                <img
                    src={image}
                    alt="상품 이미지"
                    className="w-full h-auto object-cover rounded-2xl"
                />

                {tags.map((tag: any, idx: number) => (
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
                {products.map((p: any, idx: number) => (
                    <a
                        key={idx}
                        href={p.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="
                            flex flex-col px-1 py-2.5 text-sm hover:bg-gray-100 rounded-lg
                            transition-all hover:bg-white hover:shadow-md hover:-translate-y-[1px]"
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
    );
}


export default function ProductModal({ item, onClose, clientId }: ProductModalProps) {
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
        <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="bg-[#EDF2EF] p-1.5 rounded-2xl w-[330px] relative shadow-xl flex flex-col"
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
            >
                <ProductDetailView
                    image={item.image}
                    tags={item.tags}
                    products={item.products}
                />
            </motion.div>
        </motion.div>
    );
}
