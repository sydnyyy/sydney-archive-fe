const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function addLikeApi(clientId: string, itemId: string): Promise<void> {
    const url = new URL(`${baseUrl}/api/like/${clientId}/${itemId}`);

    const res = await fetch(url.toString(), {
        method: "POST",
    });

    if (!res.ok) {
        throw new Error("좋아요 추가 실패");
    }
}

export async function deleteLikeApi(clientId: string, itemId: string): Promise<void> {
    const url = new URL(`${baseUrl}/api/like/${clientId}/${itemId}`);

    const res = await fetch(url.toString(), {
        method: "DELETE",
    });

    if (!res.ok) {
        throw new Error("좋아요 취소 실패");
    }
}

export async function fetchLikeListApi(clientId: string): Promise<Set<string>> {
    if (!clientId || clientId === "anonymous") {
        return new Set();
    }

    const url = new URL(`${baseUrl}/api/users/${clientId}/likes`);

    const res = await fetch(url.toString(), {
        method: "GET",
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("좋아요 목록 불러오기 실패");
    }

    const json: string[] = await res.json();
    return new Set(json);
}