// "use client";
//
// import { useRef } from "react";
// import { motion } from "framer-motion";
// import { Item } from "@/lib/types/item/item";
// import { sendAccessEvent } from "@/lib/accesslog/accessEventApi";
//
// interface RotatingModalProps {
//     item: Item;
//     onSelect: (item: Item) => void;
//     clientId: string;
// }

/**
 * RotatingModal
 * -----------------------
 * 카드 회전되는 UI
 * 현재 사용하지 않음
 *
 * Props:
 * - item: BaseItem, 모달에 표시할 아이템
 * - onSelect: 아이템 선택 시 호출
 * - clientId: 클라이언트 식별자
 */

// export default function RotatingModal({ item, onSelect, clientId }: RotatingModalProps) {
//     const hoverTimeout = useRef<NodeJS.Timeout | null>(null);
//     const firstProduct = item.products?.[0];
//
//     return (
//         <div className="relative w-full aspect-square perspective-[1000px] cursor-pointer">
//             <motion.div
//                 className="relative w-full h-full preserve-3d rounded-2xl"
//                 whileHover={{ rotateY: 180 }}
//                 onHoverStart={() => {
//                     hoverTimeout.current = setTimeout(() => {
//                         sendAccessEvent(clientId ?? "anonymous", item.id);
//                     }, 500);
//                 }}
//                 onHoverEnd={() => {
//                     if (hoverTimeout.current) {
//                         clearTimeout(hoverTimeout.current);
//                         hoverTimeout.current = null;
//                     }
//                 }}
//                 transition={{ duration: 0.6, ease: "easeInOut" }}
//             >
//                 {/* 앞면 */}
//                 <div className="absolute inset-0 backface-hidden rounded-2xl overflow-hidden shadow-md">
//                     <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
//                 </div>
//
//                 {/* 뒷면 */}
//                 <div
//                     className="
//                             absolute inset-0 flex flex-col items-center justify-center
//                             rounded-2xl backface-hidden rotate-y-180
//                             bg-white border-2 border-gray-200 shadow-md p-2
//                             "
//                     onClick={(e) => {
//                         e.stopPropagation();
//                         onSelect(item);
//                         if (firstProduct?.link) {
//                             window.open(firstProduct.link, "_blank");
//                         }
//                     }}
//                 >
//                     <h3 className="text-[15px] font-semibold text-gray-700 mb-2">{item.title}</h3>
//
//                     {item.description &&
//                         <p className="text-[13px] text-gray-500 mb-2">{item.description}</p>
//                     }
//
//                     {firstProduct?.link && (
//                         <p className="text-[13px] text-gray-500">📍 {firstProduct.link}</p>
//                     )}
//
//                     <p className="text-xs text-gray-400">네이버 플레이스 추가하러 가기</p>
//                 </div>
//             </motion.div>
//         </div>
//     );
// }
