import { ChatMessage } from "@/types/chat";
import { formatKST } from "@/utils/data";

interface Props {
    msg: ChatMessage;
}

export default function MessageBubble({ msg }: Props) {
    const displayTime = formatKST(msg.sendAt);

    switch (msg.type) {
        case "SYSTEM":
            return (
                <div className="mb-3 flex justify-center">
                    <div className="px-3 py-2 rounded-xl bg-blue-50 text-blue-400 text-sm font-medium">
                        {msg.content}
                    </div>
                </div>
            );

        case "ADMIN":
            return (
                <div className="mb-3 flex items-end justify-end">
                    <span className="text-xs text-gray-500 mr-1">{displayTime}</span>
                    <div className="px-3 py-2 rounded-2xl bg-blue-400 text-white">
                        {msg.content}
                    </div>
                </div>
            );

        case "USER":
        default:
            return (
                <div className="mb-3 flex items-end justify-start">
                    <div className="px-3 py-2 rounded-2xl bg-gray-200 text-black">
                        {msg.content}
                    </div>
                    <span className="text-xs text-gray-500 ml-1">{displayTime}</span>
                </div>
            );
    }
}