export async function sendAccessEvent(clientId: string, cardId: string) {
    try {
        const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;
        await fetch(`${baseUrl}/api/access`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                clientId,
                cardId,
                accessTime: new Date().toISOString(),
            }),
        });
    } catch (error) {
        console.error("Access event 전송 실패:", error);
    }
}
