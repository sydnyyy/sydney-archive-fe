import { User } from "@/types/domain/user/user";
import {httpRequestWithAuth} from "@/lib/api/apiClient";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchCurrentAdminApi(
    accessToken: string,
    refreshAccessToken: () => Promise<string>
): Promise<User> {
    return httpRequestWithAuth(
        `${API_BASE_URL}/api/a/users/me`,
        {
            method: "GET",
            credentials: "include",
        },
        accessToken,
        refreshAccessToken
    ).then(res => {
        return res.json() as Promise<User>;
    });
}