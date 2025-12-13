import { CalendarDay } from "@/lib/types/calendar.types";

export function getCalendarMatrix(year: number, month: number) {
    const firstDayOfMonth = new Date(year, month - 1, 1);
    const lastDayOfMonth = new Date(year, month, 0);

    const startWeekday = firstDayOfMonth.getDay();
    const endWeekday = lastDayOfMonth.getDay();

    const days: CalendarDay[] = [];

    // 전월 (당월 시작이 일요일이면 추가하지 않음)
    if (startWeekday !== 0) {
        const prevMonthLastDate = new Date(year, month - 1, 0).getDate();

        for (let i = startWeekday - 1; i >= 0; i--) {
            days.push({
                date: new Date(year, month - 2, prevMonthLastDate - i),
                isCurrentMonth: false,
            });
        }
    }

    // 당월
    for (let d = 1; d <= lastDayOfMonth.getDate(); d++) {
        days.push({
            date: new Date(year, month - 1, d),
            isCurrentMonth: true,
        });
    }

    // 익월 (당월이 토요일에 끝나면 추가하지 않음)
    if (endWeekday !== 6) {
        const extra = 6 - endWeekday;
        for (let i = 1; i <= extra; i++) {
            days.push({
                date: new Date(year, month, i),
                isCurrentMonth: false,
            });
        }
    }

    return days;
}
