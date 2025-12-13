"use client";

import { useEffect, useState } from "react";
import { ReadingSession } from "@/lib/types/reading-session.types";
import { fetchReadingSessionsApi } from "@/lib/api/reading-session/readingSessionApi";
import ReadingSessionAdminList from "./ReadingSessionAdminList";
import ReadingSessionAdminModal from "./ReadingSessionAdminModal";
import Calendar from "@/components/calendar/Calendar";

export default function ReadingSessionAdminPage() {
    const [sessions, setSessions] = useState<ReadingSession[]>([]);
    const [selectedSession, setSelectedSession] = useState<ReadingSession | null>(null);

    useEffect(() => {
        fetchReadingSessionsApi()
            .then((data) => setSessions(data))
            .catch((err) => {
                console.error(err);
                alert("Reading-Session 불러오기 실패");
            })
    }, []);

    return (
        <div className="flex w-full h-full">
            {/* 왼쪽 (캘린더) */}
            <div
                className="w-1/3 border-r p-5"
                style={{ borderColor: "var(--color-border-primary)" }}
            >
                <Calendar sessions={sessions} />
            </div>

            {/* 오른쪽 (세션 리스트) */}
            <div className="flex-1 p-5">
                <h2 className="text-xl font-semibold mb-3">📚 Reading Sessions</h2>

                <ReadingSessionAdminList
                    sessions={sessions}
                    onSelect={setSelectedSession}
                />
            </div>

            {/* 상세 모달 */}
            {selectedSession && (
                <ReadingSessionAdminModal
                    session={selectedSession}
                    onClose={() => setSelectedSession(null)}
                />
            )}
        </div>
    );
}
