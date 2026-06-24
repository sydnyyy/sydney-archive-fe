import {LoginSession} from "@/types/domain/auth/Auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchLoginSessionApi(previousSid?: string): Promise<LoginSession> {
    const response = await fetch(
        `${API_BASE_URL}/api/admin/login/sessions`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ previousSid })
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