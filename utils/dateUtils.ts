import { ReadingSession } from "@/lib/types/reading-session.types";

/**
 * 날짜(Year, Month, Day)만 비교하기 위해 시간 자정 설정
 * → Calendar 마킹에 날짜 비교만 필요
 *
 * @param dateStr
 */
const normalizeDate = (dateStr: string | Date): Date => {
    let date: Date;

    if (typeof dateStr === 'string') {
        const datePart = dateStr.substring(0, 10);
        const [year, month, day] = datePart.split('-').map(Number);

        date = new Date(year, month - 1, day);
    } else {
        date = new Date(dateStr);
    }

    date.setHours(0, 0, 0, 0);
    return date;
};

const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
        date1.getFullYear() === date2.getFullYear() &&
        date1.getMonth() === date2.getMonth() &&
        date1.getDate() === date2.getDate()
    );
};

export const isDateInSessionRange = (date: Date, session: ReadingSession): boolean => {
    const start = normalizeDate(session.startDate);
    const end = normalizeDate(session.endDate);
    const target = normalizeDate(date);

    return target >= start && target <= end;
};

export const isMeetingDay = (date: Date, session: ReadingSession): boolean => {
    const meeting = normalizeDate(session.meetingAt);
    return isSameDay(date, meeting);
};

export const isToday = (date: Date): boolean => {
    return isSameDay(date, new Date());
}