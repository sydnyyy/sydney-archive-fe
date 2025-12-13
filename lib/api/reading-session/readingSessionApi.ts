import { ReadingSession } from "@/lib/types/reading-session.types";

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchReadingSessionsApi(): Promise<ReadingSession[]> {
    const res = await fetch(`${baseUrl}/api/reading-sessions`, {
        method: "GET",
    });

    if (!res.ok) {
        throw new Error("Reading-Session 불러오기 실패");
    }

    return res.json();
}

export async function createReadingSessionApi(body: any): Promise<ReadingSession> {
    const res = await fetch(`${baseUrl}/api/reading-sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
    });

    if (!res.ok) {
        throw new Error("Reading-Session 생성 실패");
    }

    return res.json();
}