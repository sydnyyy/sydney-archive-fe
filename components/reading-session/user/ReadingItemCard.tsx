import React from "react";
import { ReadingSession } from "@/lib/types/reading-session.types";

interface ReadingItemCardProps {
    session: ReadingSession;
    onSelect: () => void;
    isSelected: boolean;
}

const handlePurchase = (session: ReadingSession) => {
    if (session.purchaseLink) {
        window.open(session.purchaseLink, "_blank");
    } else {
        alert("구매 링크가 없습니다.");
    }
};

const handleReserve = (session: ReadingSession) => {
    alert(`예약 기능 호출`);
};

export default function ReadingItemCard({ session, onSelect, isSelected }: ReadingItemCardProps) {

    return (
        <div
            onClick={onSelect}
            className={`
                flex flex-col
                bg-[var(--color-bg-main)]
                text-[var(--color-text-primary)]
                px-3 py-2.5 mx-2
                cursor-pointer
                transform transition-transform duration-200
                rounded-lg
                ${!isSelected ? 'hover:-translate-y-1' : ''}
            `}
        >
            <div className="flex">
                {session.imageUrl && (
                    <img
                        src={session.imageUrl}
                        alt={session.title}
                        className="w-15 h-17 object-cover rounded"
                    />
                )}

                <div className="ml-5">
                    <div className="font-semibold text-base">{session.title} - {session.author}</div>
                    <div className="text-sm mt-1">기간 {session.startDate} ~ {session.endDate}</div>
                    <div className="text-sm mt-1">미팅 {session.meetingAt}</div>
                </div>
            </div>

            {session.description && (
                <div className="text-sm mt-1 text-[var(--color-text-tertiary)]">
                    {isSelected
                        ? session.description
                        : session.description.length > 30
                            ? session.description.slice(0, 30) + " …"
                            : session.description}
                </div>
            )}

            {isSelected && (
                <div className="flex gap-2 mt-3">
                    <button
                        className="flex-1 py-2 text-sm font-semibold rounded border border-[var(--color-border-primary)]"
                        onClick={() => handlePurchase(session)}
                    >
                        구매 링크
                    </button>

                    <button
                        className="flex-1 py-2 text-sm font-semibold rounded border border-[var(--color-border-primary)]"
                    >
                        단체 채팅
                    </button>

                    <button
                        className="flex-1 py-2 text-sm font-semibold rounded border border-[var(--color-border-primary)]"
                        onClick={() => handleReserve(session)}
                    >
                        예약하기
                    </button>
                </div>
            )}
        </div>
    );
}