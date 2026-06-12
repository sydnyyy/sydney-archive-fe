import {DevLog} from "@/types/domain/devlog/devlog";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchDevLogApi(
    accessToken?: string | null
): Promise<DevLog[]> {
    const res = await fetch(
        `${API_BASE_URL}/api/devlogs`,
        {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                ...(accessToken && { "Authorization": `Bearer ${accessToken}` })
            },
        });

    if (!res.ok) {
        throw new Error("개발 로그 목록 불러오기 실패");
    }

    return res.json();
}