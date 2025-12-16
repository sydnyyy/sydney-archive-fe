"use client";

import { useState } from "react";
import CalendarGrid from "./CalendarGrid";
import { getCalendarMatrix } from "./useCalendarMatrix";
import CalendarHeader from "./CalendarHeader";
import { ReadingSession } from "@/lib/types/reading-session.types";

interface CalendarProps {
    sessions: ReadingSession[];
    selectedDate: Date | null;
    onDateSelect: (date: Date | null) => void;
}

export default function Calendar({ sessions, selectedDate, onDateSelect }: CalendarProps) {
    const today = new Date();

    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth() + 1);

    const days = getCalendarMatrix(year, month);

    const goPrev = () => {
        if (month === 1) {
            setYear(year - 1);
            setMonth(12);
        } else {
            setMonth(month - 1);
        }
    };

    const goNext = () => {
        if (month === 12) {
            setYear(year + 1);
            setMonth(1);
        } else {
            setMonth(month + 1);
        }
    };

    return (
        <div className="w-full select-none">
            <CalendarHeader
                year={year}
                month={month}
                onPrev={goPrev}
                onNext={goNext}
            />

            <CalendarGrid
                year={year}
                month={month}
                days={days}
                sessions={sessions}
                selectedDate={selectedDate}
                onDateSelect={onDateSelect}
            />
        </div>
    );
}
