const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function issueAccessTokenApi(
    loginSessionSid?: string | null,
): Promise<string> {
    const res = await fetch(
        `${API_BASE_URL}/api/a/auth/token/issue`,
        {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
            },
            ...(loginSessionSid !== null &&
                loginSessionSid !== undefined && {
                    body: JSON.stringify({ loginSessionSid }),
                }),
        }
    );

    if (!res.ok) {
        const errorData: ApiErrorResponse = await res.json();
        const error = new Error(errorData.message || "Failed to issue access token.");
        (error as any).code = errorData.code;
        (error as any).status = errorData.status;
        throw error;
    }

    const data = await res.json();
    return data.accessToken;
}

export async function logoutApi(): Promise<void> {
    const res = await fetch(
        `${API_BASE_URL}/api/a/auth/logout`,
        {
            method: "POST",
            credentials: "include",
            headers: { "Content-Type": "application/json" }
        }
    );

    if (!res.ok) {
        console.error("Failed to logout");
    }
}
