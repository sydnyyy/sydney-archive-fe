import CalendarCell from "./CalendarCell";
import { ReadingSession } from "@/lib/types/reading-session.types";
import { CalendarDay } from "@/lib/types/calendar.types";

interface CalendarGridProps {
    year: number;
    month: number;
    days: CalendarDay[];
    sessions: ReadingSession[];
}

const dayLabels = ["일", "월", "화", "수", "목", "금", "토"];

export default function CalendarGrid({ days, sessions }: CalendarGridProps) {
    return (
        <div>
            {/* 요일 */}
            <div
                className="grid grid-cols-7 text-center mb-2 text-sm"
                style={{ color: "var(--color-text-tertiary)" }}
            >
                {dayLabels.map((d) => (
                    <div key={d}>{d}</div>
                ))}
            </div>

            {/* 날짜 */}
            <div
                className="grid grid-cols-7"
                style={{ gridTemplateRows: `repeat(${days.length / 7}, 48px)` }}
            >
                {days.map((d, i) => (
                    <CalendarCell key={i} day={d} sessions={sessions} />
                ))}
            </div>
        </div>
    );
}
