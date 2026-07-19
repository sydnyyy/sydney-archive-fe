import { Admin } from "@/types/domain/user/user";
import {httpRequestWithAuth} from "@/lib/api/admin/apiClient";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchCurrentAdminApi(
    accessToken: string,
    refreshAccessToken: () => Promise<string>
): Promise<Admin> {
    return httpRequestWithAuth(
        `${API_BASE_URL}/api/admins/me`,
        {
            method: "GET",
            credentials: "include",
        },
        accessToken,
        refreshAccessToken
    ).then(response => {
        return response.json() as Promise<Admin>;
    });
}