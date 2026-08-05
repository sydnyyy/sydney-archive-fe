const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export async function sendAccessEvent(
    uid: string,
    itemId: string
): Promise<void> {
    const res = await fetch(
        `${API_BASE_URL}/api/access`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                uid,
                itemId,
                accessTime: new Date().toISOString(),
            }),
        });

    if (!res.ok) {
        console.error("Failed to send access event.");
    }
}
