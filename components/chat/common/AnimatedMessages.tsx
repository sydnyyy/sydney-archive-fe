import MessageBubble from "./MessageBubble";
import { ChatMessage } from "@/types/domain/chat/chat";
import { AnimatePresence, motion } from "framer-motion";

export default function AnimatedMessages({
                                             messages,
                                             myRole,
                                             onOptionClick,
                                         }: {
    messages: ChatMessage[];
    myRole: "USER" | "ADMIN";
    onOptionClick?: (value: "yes" | "no") => void;
}) {
    return (
        <AnimatePresence initial={false} mode="sync">
            {messages.map(msg => (
                <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    exit={{ opacity: 0, y: -20 }}
                >
                    <MessageBubble
                        msg={msg}
                        isMine={msg.type === myRole}
                        onOptionClick={onOptionClick}
                    />
                </motion.div>
            ))}
        </AnimatePresence>
    );
}