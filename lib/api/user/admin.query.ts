import { Admin } from "@/types/domain/user/user";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchCurrentAdminApi(accessToken: string): Promise<Admin> {
    const res = await fetch(
        `${API_BASE_URL}/api/admins/me`,
        {
            method: "GET",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            }
        }
    );

    if (!res.ok) {
        const errorData: ApiErrorResponse = await res.json();
        const error = new Error(errorData.message || "관리자 조회에 실패했습니다.");
        (error as any).code = errorData.code;
        (error as any).status = errorData.status;
        throw error;
    }

    return await res.json() as Admin;
}