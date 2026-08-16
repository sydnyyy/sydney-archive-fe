import {LoginSession} from "@/types/domain/auth/Auth";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function fetchLoginSessionApi(
    previousSid: string | null,
    secretHash: string
): Promise<LoginSession> {

    const response = await fetch(
        `${API_BASE_URL}/api/a/login/sessions`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ previousSid, secretHash }),
        }
    );

    if (!response.ok) {
        const errorData: ApiErrorResponse = await response.json();
        const error = new Error(errorData.message || "Failed to fetch login session.");
        (error as any).code = errorData.code;
        (error as any).status = errorData.status;
        throw error;
    }

    return await response.json();
}

export async function fetchLoginSessionAvailabilityApi(sid: string): Promise<boolean> {
    const response = await fetch(
        `${API_BASE_URL}/api/a/login/sessions/status?sid=${encodeURIComponent(sid)}`,
        {
            method: "GET",
            headers: { "Content-Type": "application/json" },
        }
    );

    if (!response.ok) {
        const errorData: ApiErrorResponse = await response.json();
        const error = new Error(errorData.message || "Failed to fetch login session status.");
        (error as any).code = errorData.code;
        (error as any).status = errorData.status;
        throw error;
    }

    const data = await response.json();

    return data.available;
}

export async function completeLoginSessionApi(
    sid: string,
    version: number,
    secret: string
): Promise<void> {

    const response = await fetch(
        `${API_BASE_URL}/api/a/login/sessions/complete`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ sid, version, secret })
        }
    );

    if (!response.ok) {
        const errorData: ApiErrorResponse = await response.json();
        const error = new Error(errorData.message || "Failed to login.");
        (error as any).code = errorData.code;
        (error as any).status = errorData.status;
        throw error;
    }
}