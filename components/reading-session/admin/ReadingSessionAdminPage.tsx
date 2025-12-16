"use client";

import { useEffect, useMemo, useState } from "react";
import { ReadingSession } from "@/lib/types/reading-session.types";
import { fetchReadingSessionsApi } from "@/lib/api/reading-session/readingSessionApi";
import ReadingSessionAdminList from "./ReadingSessionAdminList";
import ReadingSessionAdminDetailModal from "./ReadingSessionAdminDetailModal";
import Calendar from "@/components/calendar/Calendar";
import { isDateInSessionRange, isMeetingDay } from "@/utils/dateUtils";

export default function ReadingSessionAdminPage() {
    const [sessions, setSessions] = useState<ReadingSession[]>([]);
    const [selectedSession, setSelectedSession] = useState<ReadingSession | null>(null);
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
        <div className="flex w-full h-full">
            {/* 왼쪽 (캘린더) */}
            <div className="w-1/3 p-5">
                <Calendar
                    sessions={sessions}
                    selectedDate={selectedDate}
                    onDateSelect={setSelectedDate}
                />
            </div>

            {/* 오른쪽 (세션 리스트) */}
            <div className="flex-1 p-5 overflow-y-auto hide-scrollbar">
                <h2 className="text-xl font-semibold mb-3">📚 Reading Sessions</h2>
                <ReadingSessionAdminList
                    sessions={filteredSessions}
                    onSelect={setSelectedSession}
                />
            </div>

            {/* 상세 모달 */}
            {selectedSession && (
                <ReadingSessionAdminDetailModal
                    session={selectedSession}
                    onClose={() => setSelectedSession(null)}
                />
            )}
        </div>
    );
}
