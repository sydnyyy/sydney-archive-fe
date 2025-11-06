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
                <div className="px-3 py-2 rounded-xl text-sm font-medium bg-[#E1E8E5] text-[#6CA67C]">
                    {msg.content}
                </div>
            </div>
        );
    }

    const bubbleClass = `px-3 py-2 rounded-2xl break-words ${
        isMine ? "bg-[#6CA67C] text-white" : "bg-[#e6ebed] text-black"
    }`;

    return (
        <div className={`mb-2 flex items-end ${isMine ? "justify-end" : "justify-start"} gap-2`}>
            {isMine ? (
                <>
                    <span className="text-xs text-gray-500">{time}</span>
                    <div className={bubbleClass}>
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
                    <div className={bubbleClass}>
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
                    <span className="text-xs text-gray-500">{time}</span>
                </>
            )}
        </div>
    );
}
