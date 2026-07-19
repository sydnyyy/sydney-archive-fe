import MessageBubble from "./MessageBubble";
import { ChatMessage } from "@/types/domain/chat/chat";
import { AnimatePresence, motion } from "framer-motion";

interface AnimatedMessageProps {
    messages: ChatMessage[];
    role: "USER" | "ADMIN";
}

export default function AnimatedMessages({ messages, role }: AnimatedMessageProps) {
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
                        isMine={msg.type === role}
                    />
                </motion.div>
            ))}
        </AnimatePresence>
    );
}