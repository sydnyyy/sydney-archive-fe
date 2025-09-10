export async function sendAccessEvent(clientId: string, cardId: string) {
    try {
        await fetch("http://localhost:8080/api/access", {
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
