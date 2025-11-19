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

export async function fetchLikeListApi(clientId: string): Promise<Record<string, boolean>> {
    if (!clientId || clientId === "anonymous") {
        return {};
    }

    const url = new URL(`${baseUrl}/api/users/${clientId}/likes`);

    const res = await fetch(url.toString(), {
        method: "GET",
        cache: "no-store",
    });

    if (!res.ok) {
        throw new Error("좋아요 목록 불러오기 실패");
    }

    return res.json();
}