const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function addLikeApi(
    uid: string,
    itemId: string
): Promise<void> {
     const res = await fetch(
        `${API_BASE_URL}/api/like/${uid}/${itemId}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
        });

    if (!res.ok) {
        const errorData: ApiErrorResponse = await res.json();
        const error = new Error(errorData.message || "Failed to like the item.");
        (error as any).code = errorData.code;
        (error as any).status = errorData.status;
        throw error;
    }
}

export async function deleteLikeApi(
    uid: string,
    itemId: string
): Promise<void> {
    const res = await fetch(
        `${API_BASE_URL}/api/like/${uid}/${itemId}`,
        {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        });

    if (!res.ok) {
        const errorData: ApiErrorResponse = await res.json();
        const error = new Error(errorData.message || "Failed to unlike the item.");
        (error as any).code = errorData.code;
        (error as any).status = errorData.status;
        throw error;
    }
}

export async function fetchLikeListApi(uid: string): Promise<Set<string>> {
    const res = await fetch(
        `${API_BASE_URL}/api/users/${uid}/likes`,
        {
            method: "GET",
            headers: { "Content-Type": "application/json" },
            cache: "no-store",
        });

    if (!res.ok) {
        const errorData: ApiErrorResponse = await res.json();
        const error = new Error(errorData.message || "Failed to fetch likes.");
        (error as any).code = errorData.code;
        (error as any).status = errorData.status;
        throw error;
    }

    const json: string[] = await res.json();
    return new Set(json);
}