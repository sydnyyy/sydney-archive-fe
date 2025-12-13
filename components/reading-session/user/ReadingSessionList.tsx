import { useEffect, useState } from "react";
import ModalLayout from "@/components/common/ModalLayout";
import ReadingItemCard from "./ReadingItemCard";
import { ReadingSession } from "@/lib/types/reading-session.types";
import { fetchReadingSessionsApi } from "@/lib/api/reading-session/readingSessionApi";

interface ReadingSessionListProps {
    onClose: () => void;
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

export default function ReadingSessionList({ onClose }: ReadingSessionListProps) {
    const [sessions, setSessions] = useState<ReadingSession[]>([]);
    const [selectedSession, setSelectedSession] = useState<ReadingSession | null>(null);

    useEffect(() => {
        fetchReadingSessionsApi()
            .then((data) => setSessions(data))
            .catch((err) => {
                console.error(err);
                alert("Reading-Session 불러오기 실패");
                onClose();
            })
    }, []);

    return (
        <ModalLayout onClose={onClose}>
            <div className="flex flex-col gap-2 w-full">
                <h2 className="text-xl font-medium mt-1 mb-1 mx-4">📚 Read with me</h2>

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
        </ModalLayout>
    );
}