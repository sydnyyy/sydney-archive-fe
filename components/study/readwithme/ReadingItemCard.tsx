import React from "react";
import { BookSession } from "@/lib/types/study.types";

interface ReadingItemCardProps {
    session: BookSession;
    onSelect: () => void;
    isSelected: boolean;
}

export default function ReadingItemCard({ session, onSelect, isSelected }: ReadingItemCardProps) {

    const hoverEffectClass = isSelected
        ? '' // 선택된 경우 → 호버 효과 제거
        : 'hover:-translate-y-1'; // 선택되지 않은 경우 → 호버 시 위로 뜨는 효과 적용

    const roundingClass = isSelected
        ? 'rounded-t-lg rounded-b-none' // 선택됨 → 하단 모서리 제거
        : 'rounded-lg'; // 선택 안 됨 → 전체 라운딩 유지

    const cardClasses = `
        flex items-center justify-between
        bg-[var(--color-bg-main)]
        text-[var(--color-text-primary)]
        px-5 py-2.5 mx-2
        cursor-pointer
        transform transition-transform duration-200
        ${roundingClass} // 라운딩 조건부 적용
        ${hoverEffectClass} // 호버 효과 조건부 적용
    `;

    return (
        <div
            onClick={onSelect}
            className={cardClasses}
        >
            {session.imageUrl && (
                <img
                    src={session.imageUrl}
                    alt={session.title}
                    className="w-17 h-20 object-cover rounded"
                />
            )}

            <div className="ml-5 flex-1">
                <div className="font-medium text-base">{session.title}</div>
                <div className="text-sm mt-1">{session.author}</div>
                <div className="text-sm mt-1">{session.period}</div>
                <div className="text-sm mt-1">{session.meetingDate}</div>
            </div>
        </div>
    );
}