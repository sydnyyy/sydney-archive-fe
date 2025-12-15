"use client";

import { useEffect, useState } from "react";
import { ReadingSession } from "@/lib/types/reading-session.types";
import { fetchReadingSessionsApi } from "@/lib/api/reading-session/readingSessionApi";
import Calendar from "@/components/calendar/Calendar";
import ReadingSessionList from "@/components/reading-session/user/ReadingSessionList";
import ModalLayout from "@/components/common/ModalLayout";

interface ReadingSessionPageProps {
    onClose: () => void;
}

export default function ReadingSessionPage({ onClose }: ReadingSessionPageProps) {
    const [sessions, setSessions] = useState<ReadingSession[]>([]);

    useEffect(() => {
        fetchReadingSessionsApi()
            .then((data) => setSessions(data))
            .catch((err) => {
                console.error(err);
                alert("Reading-Session 불러오기 실패");
            })
    }, []);

    return (
        <ModalLayout
            onClose={onClose}
            widthClass="w-[760px] min-w-[760px]"
            heightClass="h-[440px]"
            scrollable={false}
        >
            <h2 className="text-xl font-semibold p-3">📚 Reading Sessions</h2>
            <div className="flex w-full h-full overflow-hidden">

                {/* 왼쪽 (캘린더) */}
                <div className="w-[320px] p-3 shrink-0 h-full">
                    <Calendar sessions={sessions} />
                    <p className="text-xs text-[var(--color-text-tertiary)] mt-4">
                        날짜를 클릭하면 세션을 볼 수 있어요
                    </p>
                </div>

                {/* 오른쪽 (세션 리스트) */}
                <div className="flex-1 p-0 h-full overflow-y-auto hide-scrollbar">
                    <ReadingSessionList sessions={sessions}/>
                </div>

            </div>
        </ModalLayout>
    );
}