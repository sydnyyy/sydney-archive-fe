const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function sendAccessEvent(
    sid: string,
    itemId: string
): Promise<void> {
    try {
        await fetch(`${API_BASE_URL}/api/access`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                sid,
                itemId,
                accessTime: new Date().toISOString(),
            }),
        });
    } catch (error) {
        console.error("Access event 전송 실패:", error);
    }
}
