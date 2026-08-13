export async function hashSecret(secret: string): Promise<string> {

    const data = new TextEncoder().encode(secret);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);

    return btoa(
        String.fromCharCode(...new Uint8Array(hashBuffer))
    )
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
}