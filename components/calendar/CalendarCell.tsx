import { ReadingSession } from "@/lib/types/reading-session.types";
import { CalendarDay } from "@/lib/types/calendar.types";
import { isDateInSessionRange, isMeetingDay, isToday } from "@/utils/dateUtils";

interface CalendarCellProps {
    day: CalendarDay;
    sessions: ReadingSession[];
    selectedDate: Date | null;
    onDateSelect: (date: Date | null) => void;
}

export default function CalendarCell({ day, sessions, selectedDate, onDateSelect }: CalendarCellProps) {
    const cellDate = day.date;

    const rangeSession = sessions.find(s => isDateInSessionRange(cellDate, s));
    const meetingSession = sessions.find(s => isMeetingDay(cellDate, s));
    const isCurrentDay = isToday(cellDate);

    const textColor = day.isCurrentMonth
        ? "var(--color-text-primary)"
        : "var(--color-text-quaternary)";

    const isSelected =
        selectedDate && cellDate.toDateString() === selectedDate.toDateString();

    return (
        <div
            className="relative h-12 flex items-center justify-center cursor-pointer"
            onClick={() => {
                if (!day.isCurrentMonth) return;

                if (selectedDate && cellDate.toDateString() === selectedDate.toDateString()) {
                    onDateSelect(null);
                } else {
                    onDateSelect(cellDate)
                }
            }}
        >

            {rangeSession && (
                <div
                    className="absolute inset-0 z-10"
                    style={{
                        backgroundColor: "var(--color-calendar-highlight-bg)",
                        opacity: 0.2
                    }}
                />
            )}

            <div
                className="relative z-20 w-8 h-8 flex items-center justify-center rounded-full text-sm font-medium"
                style={{
                    color: textColor,
                    backgroundColor: isSelected
                        ? "var(--color-calendar-selected-bg)"
                        : "transparent",
                }}
            >
                {isCurrentDay && (
                    <div
                        className="absolute inset-0 border-2 rounded-full"
                        style={{ borderColor: "var(--color-calendar-border)" }}
                    />
                )}
                {cellDate.getDate()}
            </div>

            {meetingSession && (
                <div
                    className="absolute z-30 w-1.5 h-1.5 rounded-full mt-7"
                    style={{ backgroundColor: "var(--color-calendar-accent)" }}
                />
            )}
        </div>
    );
}