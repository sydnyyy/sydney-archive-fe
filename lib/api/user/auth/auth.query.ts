import {User} from "@/types/domain/user/user";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchCurrentGuestApi(
    accessToken: string
): Promise<User> {

    return fetch(
        `${API_BASE_URL}/api/g/users/me`,
        {
            method: "GET",
            credentials: "include",
            headers: { Authorization: `Bearer ${accessToken}` }
        },
    ).then(response => {
        return response.json() as Promise<User>;
    });
}