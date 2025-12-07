import { ReadingSession } from "@/lib/types/reading-session.types";
import { CalendarDay } from "@/lib/types/calendar.types";

interface CalendarCellProps {
    day: CalendarDay;
    sessions: ReadingSession[];
}

export default function CalendarCell({ day }: CalendarCellProps) {
    return (
        <div
            className="h-12 flex items-center justify-center"
            style={{
                color: day.isCurrentMonth
                    ? "var(--color-text-primary)"
                    : "var(--color-text-quaternary)",
            }}
        >
            {day.date.getDate()}
        </div>
    );
}
