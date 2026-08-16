import {httpRequestWithAuth} from "@/lib/api/apiClient";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchLikeListApi(
    accessToken: string,
    refreshAccessToken: () => Promise<string>
): Promise<Set<string>> {

    return httpRequestWithAuth(
        `${API_BASE_URL}/api/g/likes`,
        {
            method: "GET",
            credentials: "include",
            cache: "no-store",
        },
        accessToken,
        refreshAccessToken
    ).then(async res => {
        const json = await res.json() as string[];
        return new Set(json);
    });
}

export async function addLikeApi(
    itemId: string,
    accessToken: string,
    refreshAccessToken: () => Promise<string>
): Promise<void> {

    await httpRequestWithAuth(
        `${API_BASE_URL}/api/g/likes/${itemId}`,
        {
            method: "POST",
            credentials: "include",
        },
        accessToken,
        refreshAccessToken
    );
}

export async function deleteLikeApi(
    itemId: string,
    accessToken: string,
    refreshAccessToken: () => Promise<string>
): Promise<void> {

    await httpRequestWithAuth(
        `${API_BASE_URL}/api/g/likes/${itemId}`,
        {
            method: "DELETE",
            credentials: "include",
        },
        accessToken,
        refreshAccessToken
    );
}