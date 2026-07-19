export async function httpRequestWithAuth(
    url: string,
    options: RequestInit = {},
    accessToken: string,
    refreshAccessToken: () => Promise<string>
) {
    const request = async (token: string) => {
        return fetch(
            url,
            {
                ...options,
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                    ...options.headers,
                },
        });
    };

    let response = await request(accessToken);

    if (response.status === 401) {
        console.error("401 Unauthorized. Attempting to refresh access token.");
        const newAccessToken = await refreshAccessToken();
        response = await request(newAccessToken);
    }

    if (!response.ok) {
        const errorData: ApiErrorResponse = await response.json();
        const error = new Error(errorData.message || url + " API request failed with status code " + response.status);
        (error as any).code = errorData.code;
        (error as any).status = errorData.status;
        throw error;
    }

    return response;
}
