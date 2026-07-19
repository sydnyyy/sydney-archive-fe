const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchGuestSid(): Promise<string> {
    const res = await fetch(
        `${API_BASE_URL}/api/auth/sid`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" }
        }
    );

    if (!res.ok) {
        const errorData: ApiErrorResponse = await res.json();
        const error = new Error(errorData.message || "Failed to fetch Guest SID.");
        (error as any).code = errorData.code;
        (error as any).status = errorData.status;
        throw error;
    }

    const data = await res.json();
    return data.sid;
}