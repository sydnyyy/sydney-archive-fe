import { ChatMessage } from "@/types/domain/chat/chat";
import { formatKST } from "@/utils/data";

interface MessageBubbleProps {
    msg: ChatMessage;
    isMine: boolean;
}

export default function MessageBubble({ msg, isMine }: MessageBubbleProps) {
    const time = formatKST(msg.createdAt)?.slice(13, 19);

    if (msg.type === "SYSTEM") {
        return (
            <div className="mb-3 flex justify-center">
                <div
                    className="
                        px-3 py-2
                        rounded-xl
                        text-sm font-medium
                        bg-[var(--color-chat-system-bg)]
                        text-[var(--color-chat-system-text)]
                    "
                >
                    {msg.content}
                </div>
            </div>
        );
    }

    const bubbleClass = isMine
        ? "bg-[var(--color-chat-mine-bg)] text-[var(--color-chat-mine-text)]"
        : "bg-[var(--color-chat-other-bg)] text-[var(--color-chat-other-text)]";

    return (
        <div className={`mb-2 flex items-end ${isMine ? "justify-end" : "justify-start"} gap-2`}>
            {isMine ? (
                <>
                    <span className="text-xs text-[var(--color-chat-time)]">
                        {time}
                    </span>
                    <div className={`break-words rounded-2xl px-3 py-2 ${bubbleClass}`}>
                        {msg.content}
                    </div>
                </>
            ) : (
                <>
                    <div className={`break-words rounded-2xl px-3 py-2 ${bubbleClass}`}>
                        {msg.content}
                    </div>
                    <span className="text-xs text-[var(--color-chat-time)]">
                        {time}
                    </span>
                </>
            )}
        </div>
    );
}
