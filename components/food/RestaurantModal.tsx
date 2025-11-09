import { motion } from "framer-motion";
import { FoodItem, RestaurantItem } from "@/lib/types";
import { ITEM_TYPE, FOOD_FORMAT } from "@/lib/types";
import { sendAccessEvent } from "@/lib/accesslog/accessEventApi";
import { useRef } from "react";

interface RestaurantProps {
    item: RestaurantItem;
    onSelect: (item: FoodItem) => void;
    clientId: string;
}

export default function RestaurantModal({ item, onSelect, clientId }: RestaurantProps) {
    const hoverTimeout = useRef<NodeJS.Timeout | null>(null);

    if (item.type === ITEM_TYPE.FOOD && "format" in item && item.format === FOOD_FORMAT.RESTAURANT) {
        return (
            <div className="relative w-full aspect-square perspective-[1000px] cursor-pointer">
                <motion.div
                    className="relative w-full h-full preserve-3d rounded-2xl"
                    whileHover={{ rotateY: 180 }}
                    onHoverStart={() => {
                        hoverTimeout.current = setTimeout(() => {
                            sendAccessEvent(clientId ?? "anonymous", item.id);
                        }, 500);
                    }}
                    onHoverEnd={() => {
                        if (hoverTimeout.current) {
                            clearTimeout(hoverTimeout.current);
                            hoverTimeout.current = null;
                        }
                    }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                >
                    {/* 앞면 */}
                    <div className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden">
                        <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
                    </div>

                    {/* 뒷면 */}
                    <div
                        className="
                            absolute inset-0 flex flex-col items-center justify-center
                            rounded-2xl backface-hidden rotate-y-180
                            bg-white border-2 border-gray-200 shadow-md p-2
                            "
                        onClick={(e) => {
                            e.stopPropagation();
                            onSelect(item);
                            sendAccessEvent(clientId ?? "anonymous", item.id);
                        }}
                    >
                        <h3 className="text-[15px] font-semibold text-gray-700 mb-2">{item.title}</h3>
                        {item.description && <p className="text-[13px] text-gray-500 mb-2">{item.description}</p>}
                        {item.location && <p className="text-[13px] text-gray-500">📍 {item.location}</p>}
                        <p className="text-xs text-gray-400">클릭 시 상세 페이지 이동</p>
                    </div>
                </motion.div>
            </div>
        );
    }

    return (
        <img
            src={item.image}
            alt={item.title}
            className="w-full h-full aspect-square object-cover rounded-lg cursor-pointer"
            onClick={() => {
                onSelect(item);
                sendAccessEvent(clientId ?? "anonymous", item.id);
            }}
        />
    );
}
