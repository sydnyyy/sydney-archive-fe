import {DevLogCreateRequest, DevLogUpdateRequest} from "@/types/dto/devlog/DevLogRequest";
import {DevLog} from "@/types/domain/devlog/devlog";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function createDevLogApi(
    devLogCreateRequest: DevLogCreateRequest,
    accessToken: string
): Promise<DevLog> {
    const res = await fetch(
        `${API_BASE_URL}/api/devlogs`,
        {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify(devLogCreateRequest)
        });

    if (!res.ok) {
        throw new Error("개발 로그 생성 실패");
    }

    return res.json();
}

export async function updateDevLogApi(
    devLogUpdateRequest: DevLogUpdateRequest,
    accessToken: string
): Promise<DevLog> {
    const res = await fetch(
        `${API_BASE_URL}/api/devlogs`,
        {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
            body: JSON.stringify(devLogUpdateRequest)
        });

    if (!res.ok) {
        throw new Error("개발 로그 업데이트 실패");
    }

    return res.json();
}

export async function deleteDevLogApi(
    accessToken: string
): Promise<DevLog> {
    const res = await fetch(
        `${API_BASE_URL}/api/devlogs`,
        {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${accessToken}`
            },
        });

    if (!res.ok) {
        throw new Error("개발 로그 삭제 실패");
    }

    return res.json();
}


