import {LoginSession} from "@/types/domain/auth/Auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchLoginSessionApi(
    previousSid: string | null
): Promise<LoginSession> {
    const response = await fetch(
        `${API_BASE_URL}/api/admin/login/sessions`,
        {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            ...(previousSid !== null && {
                body: JSON.stringify({ previousSid }),
            }),
        }
    );

    if (!response.ok) {
        const errorData: ApiErrorResponse = await response.json();
        const error = new Error(errorData.message || "로그인 세션 생성을 실패했습니다.");
        (error as any).code = errorData.code;
        (error as any).status = errorData.status;
        throw error;
    }

    return await response.json();
}

export async function fetchLoginSessionAvailabilityApi(sid: string): Promise<boolean> {
    const response = await fetch(
        `${API_BASE_URL}/api/admin/login/sessions/status?sid=${encodeURIComponent(sid)}`,
        {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        }
    );

    if (!response.ok) {
        const errorData: ApiErrorResponse = await response.json();
        const error = new Error(errorData.message || "로그인 세션 상태 조회를 실패했습니다.");
        (error as any).code = errorData.code;
        (error as any).status = errorData.status;
        throw error;
    }

    const data = await response.json();

    return data.available;
}

export async function completeLoginSessionApi(
    sid: string,
    version: number
): Promise<void> {
    const response = await fetch(
        `${API_BASE_URL}/api/admin/login/sessions/complete`,
        {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sid, version })
        }
    );

    if (!response.ok) {
        const errorData: ApiErrorResponse = await response.json();
        const error = new Error(errorData.message || "로그인을 실패했습니다.");
        (error as any).code = errorData.code;
        (error as any).status = errorData.status;
        throw error;
    }
}