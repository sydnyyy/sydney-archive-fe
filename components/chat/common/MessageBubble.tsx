import { ChatMessage } from "@/types/chat";
import { formatKST } from "@/utils/data";

interface MessageBubbleProps {
    msg: ChatMessage;
    isMine: boolean;
    onOptionClick?: (value: "yes" | "no") => void;
}

export default function MessageBubble({ msg, isMine, onOptionClick }: MessageBubbleProps) {
    const time = formatKST(msg.sendAt)?.slice(13, 19);

    if (msg.type === "SYSTEM") {
        return (
            <div className="mb-3 flex justify-center">
                <div
                    className="px-3 py-2 rounded-xl text-sm font-medium"
                    style={{
                        backgroundColor: "var(--color-chat-system-bg)",
                        color: "var(--color-chat-system-text)",
                    }}
                >
                    {msg.content}
                </div>
            </div>
        );
    }

    const bubbleStyle = isMine
        ? {
            backgroundColor: "var(--color-chat-mine-bg)",
            color: "var(--color-chat-mine-text)",
        }
        : {
            backgroundColor: "var(--color-chat-other-bg)",
            color: "var(--color-chat-other-text)",
        };

    return (
        <div className={`mb-2 flex items-end ${isMine ? "justify-end" : "justify-start"} gap-2`}>
            {isMine ? (
                <>
                    <span className="text-xs"
                          style={{ color: "var(--color-chat-time)" }}
                    >
                        {time}
                    </span>
                    <div className="px-3 py-2 rounded-2xl break-words" style={bubbleStyle}>
                        {msg.content}
                        {msg.options && onOptionClick && (
                            <div className="mt-2 flex gap-2 justify-center">
                                {msg.options.map(o => (
                                    <button
                                        key={o.value}
                                        onClick={() => onOptionClick(o.value as "yes" | "no")}
                                        className="px-3 py-1 rounded-lg border"
                                    >
                                        {o.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </>
            ) : (
                <>
                    <div className="px-3 py-2 rounded-2xl break-words" style={bubbleStyle}>
                        {msg.content}
                        {msg.options && onOptionClick && (
                            <div className="mt-2 flex gap-2 justify-center">
                                {msg.options.map(o => (
                                    <button
                                        key={o.value}
                                        onClick={() => onOptionClick(o.value as "yes" | "no")}
                                        className="px-3 py-1 rounded-lg border"
                                    >
                                        {o.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                    <span className="text-xs"
                          style={{ color: "var(--color-chat-time)" }}
                    >
                        {time}
                    </span>
                </>
            )}
        </div>
    );
}
