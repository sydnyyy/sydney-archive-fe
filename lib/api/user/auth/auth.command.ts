const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchUid(
    uid?: string | null
): Promise<string> {
    const res = await fetch(
        `${API_BASE_URL}/api/users/uid`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: uid ? JSON.stringify({ uid }) : undefined
        }
    );

    if (!res.ok) {
        const errorData: ApiErrorResponse = await res.json();
        const error = new Error(errorData.message || "Failed to fetch Guest UID.");
        (error as any).code = errorData.code;
        (error as any).status = errorData.status;
        throw error;
    }

    const data = await res.json();
    return data.uid;
}