"use client";

import { useState } from "react";
import ReadingItemCard from "./ReadingItemCard";
import { ReadingSession } from "@/lib/types/reading-session.types";

interface ReadingSessionListProps {
    sessions: ReadingSession[];
}

const handlePurchase = (session: ReadingSession) => {
    if (session.purchaseLink) {
        window.open(session.purchaseLink, "_blank");
    } else {
        alert("구매 링크가 없습니다.");
    }
};

const handleChangeSchedule = () => {
    alert("일정 변경 기능 호출");
};

const handleReserve = (session: ReadingSession) => {
    alert(`예약 기능 호출`);
};

export default function ReadingSessionList({ sessions }: ReadingSessionListProps) {
    const [selectedSession, setSelectedSession] = useState<ReadingSession | null>(null);

    return (
        <div className="flex flex-col gap-2 w-full">
            {sessions.map((session) => {
                const isSelected = selectedSession?.id === session.id;

                return (
                    <div key={session.id} className="flex flex-col gap-0">
                        <ReadingItemCard
                            session={session}
                            onSelect={() =>
                                setSelectedSession(isSelected ? null : session)
                            }
                            isSelected={isSelected}
                        />

                        {/* 하단 확장 버튼 영역 */}
                        {isSelected && (
                            <div
                                className="
                                        px-3 py-2.5 mx-2
                                        bg-[var(--color-bg-main)]
                                        text-[var(--color-text-primary)]
                                        rounded-b-lg rounded-t-none
                                    "
                            >
                                <div className="flex gap-3 justify-center">
                                    <button
                                        className="flex-1 py-2 text-sm font-semibold rounded transition-colors border"
                                        onClick={() => handlePurchase(session)}
                                    >
                                        구매 링크
                                    </button>

                                    <button
                                        className="flex-1 py-2 text-sm font-semibold rounded border"
                                        onClick={handleChangeSchedule}
                                    >
                                        일정 변경
                                    </button>

                                    <button
                                        className="flex-1 py-2 text-sm font-semibold rounded border"
                                        onClick={() => handleReserve(session)}
                                    >
                                        예약하기
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}