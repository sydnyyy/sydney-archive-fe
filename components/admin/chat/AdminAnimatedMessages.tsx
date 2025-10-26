import { ChatMessage } from "@/types/chat";
import { formatKST } from "@/utils/formatKSTShort";

interface Props {
    msg: ChatMessage;
}

export default function AdminAnimatedMessages({ msg }: Props) {
    const displayTime = formatKST(msg.sendAt);

    switch (msg.type) {
        case "SYSTEM":
            return (
                <div className="mb-3 flex justify-center">
                    <div className="px-3 py-2 rounded-xl text-sm font-medium bg-[#E1E8E5] text-[#6CA67C]">
                        {msg.content}
                    </div>
                </div>
            );

        case "ADMIN":
            return (
                <div className="mb-3 flex items-end justify-end">
                    <span className="text-xs text-gray-500 mr-2">{displayTime}</span>
                    <div className="px-3 py-2 rounded-2xl text-[#000000] bg-[#e6ebed]">
                        {msg.content}
                    </div>
                </div>
            );

        case "USER":
        default:
            return (
                <div className="mb-3 flex items-end justify-start">
                    <div className="px-3 py-2 rounded-2xl bg-[#6CA67C] text-[#FFFFFF]">
                        {msg.content}
                    </div>
                    <span className="text-xs text-gray-500 ml-2">{displayTime}</span>
                </div>
            );
    }
}