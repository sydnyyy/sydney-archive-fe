import { motion } from "framer-motion";
import { Item } from "@/lib/types";

interface ItemCardProps {
    item: Item;
    onSelect: (item: Item) => void;
}

export default function RestaurantCard({ item, onSelect }: ItemCardProps) {
    if (item.type === "음식" && "format" in item && item.format === "음식점") {
        return (
            <div className="relative w-full aspect-square perspective-[1000px] cursor-pointer">
                <motion.div
                    className="relative w-full h-full preserve-3d rounded-2xl"
                    whileHover={{ rotateY: 180 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                    {/* 앞면 */}
                    <div className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>

                    {/* 뒷면 */}
                    <a
                        href={item.link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="absolute inset-0 flex flex-col items-center justify-center
                      rounded-2xl backface-hidden rotate-y-180
                      bg-white border-2 border-gray-200 shadow-md p-2"
                    >
                        <h3 className="text-[15px] font-semibold text-gray-700 mb-2">{item.title}</h3>
                        {item.description && <p className="text-[13px] text-gray-500 mb-2">{item.description}</p>}
                        {item.location && <p className="text-[13px] text-gray-500">📍 {item.location}</p>}
                        <p className="text-xs text-gray-400">클릭 시 상세 페이지 이동</p>
                    </a>
                </motion.div>
            </div>
        );
    }

    return (
        <img
            src={item.image}
            alt={item.title}
            className="w-full h-full aspect-square object-cover rounded-lg cursor-pointer"
            onClick={() => onSelect(item)}
        />
    );
}
