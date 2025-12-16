"use client";

import { useEffect, useMemo, useState } from "react";
import { ReadingSession } from "@/lib/types/reading-session.types";
import { fetchReadingSessionsApi } from "@/lib/api/reading-session/readingSessionApi";
import Calendar from "@/components/calendar/Calendar";
import ReadingSessionList from "@/components/reading-session/user/ReadingSessionList";
import ModalLayout from "@/components/common/ModalLayout";
import { isDateInSessionRange, isMeetingDay } from "@/utils/dateUtils";

interface ReadingSessionPageProps {
    onClose: () => void;
}

export default function ReadingSessionPage({ onClose }: ReadingSessionPageProps) {
    const [sessions, setSessions] = useState<ReadingSession[]>([]);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);

    useEffect(() => {
        fetchReadingSessionsApi()
            .then((data) => setSessions(data))
            .catch((err) => {
                console.error(err);
                alert("Reading-Session 불러오기 실패");
            })
    }, []);

    const filteredSessions = useMemo(() => {
        if (!selectedDate) return sessions;

        return sessions.filter(
            (s) =>
                isDateInSessionRange(selectedDate, s) ||
                isMeetingDay(selectedDate, s)
        );
    }, [sessions, selectedDate]);

    return (
        <ModalLayout
            onClose={onClose}
            widthClass="w-[760px]"
            heightClass="h-[85vh] md:h-[52vh]"
            scrollable={false}
        >
            <div className="flex flex-col h-full overflow-hidden">
                <h2 className="text-lg font-semibold p-3">
                    📚 Reading Sessions
                </h2>

                <div className="flex flex-col md:flex-row w-full h-full overflow-hidden">

                    {/* 왼쪽 (캘린더) */}
                    <div className="w-full md:w-[320px] p-3 shrink-0">
                        <Calendar
                            sessions={sessions}
                            selectedDate={selectedDate}
                            onDateSelect={setSelectedDate}
                        />
                        <p className="text-xs text-[var(--color-text-tertiary)] mt-3 mb-3">
                            날짜를 클릭하면 세션을 볼 수 있어요
                        </p>
                    </div>

                    {/* 오른쪽 (세션 리스트) */}
                    <div className="flex-1 overflow-y-auto hide-scrollbar">
                        <ReadingSessionList sessions={filteredSessions}/>
                    </div>

                </div>
            </div>
        </ModalLayout>
    );
}