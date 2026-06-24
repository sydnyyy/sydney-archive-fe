const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function issueAccessTokenApi(): Promise<string> {
    const res = await fetch(
        `${API_BASE_URL}/api/admin/auth/token/issue`,
        {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
        }
    );

    if (!res.ok) {
        const errorData: ApiErrorResponse = await res.json();
        const error = new Error(errorData.message || "액세스 토큰 생성에 실패했습니다.");
        (error as any).code = errorData.code;
        (error as any).status = errorData.status;
        throw error;
    }

    const data = await res.json();
    return data.accessToken;
}

export async function logoutApi(): Promise<void> {
    const res = await fetch(
        `${API_BASE_URL}/api/admin/auth/logout`,
        {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" }
        }
    );

    if (!res.ok) {
        throw new Error("logout failed");
    }
}
