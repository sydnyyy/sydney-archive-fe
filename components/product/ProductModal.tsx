import { motion } from "framer-motion";
import TaggedImage from "@/components/common/TaggedImage";
import { Item } from "@/lib/types";
import { ITEM_TYPE } from "@/lib/types";

interface ProductModalProps {
    selectedItem: Item;
    onClose: () => void;
}

export default function ProductModal({ selectedItem, onClose }: ProductModalProps) {
    return (
        <motion.div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
        >
            <motion.div
                className="bg-white p-3 rounded-2xl w-[90%] max-w-md relative shadow-xl"
                onClick={(e) => e.stopPropagation()}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeOut" }}
            >
                <TaggedImage
                    image={selectedItem.image}
                    tags={selectedItem.type === ITEM_TYPE.PRODUCT ? selectedItem.tags ?? [] : []}
                />
            </motion.div>
        </motion.div>
    );
}
