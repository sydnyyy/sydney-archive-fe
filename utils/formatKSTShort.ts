export function formatKST(utcString: string): string {
    const date = new Date(utcString);

    const options: Intl.DateTimeFormatOptions = {
        timeZone: "Asia/Seoul",
        hour12: false,
        year: "2-digit",
        month: "2-digit",
        day: "2-digit",
        hour: "numeric",
        minute: "2-digit",
    };

    const parts = new Intl.DateTimeFormat("ko-KR", options).formatToParts(date);

    const year = parts.find(p => p.type === "year")?.value ?? "00";
    const month = parts.find(p => p.type === "month")?.value ?? "00";
    const day = parts.find(p => p.type === "day")?.value ?? "00";
    const hour = parts.find(p => p.type === "hour")?.value ?? "00";
    const minute = parts.find(p => p.type === "minute")?.value ?? "00";

    return `${year}.${month}.${day} ${hour}:${minute}`;
}