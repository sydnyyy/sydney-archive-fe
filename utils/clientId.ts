import { v4 as uuidv4 } from "uuid";
import { CLIENT_ID_KEY } from "@/constants/auth/storageKeys";

export function getOrCreateId(
    storage: Storage,
    key: string,
    length: number = 8
): string {
    let id = storage.getItem(key);

    if (!id) {
        const browserName = getBrowserName();
        const randomPart = uuidv4().replace(/-/g, "").slice(0, length);
        id = `${browserName}_${randomPart}`;
        storage.setItem(key, id);
    }

    return id;
}

export function getOrCreateClientId(
    length: number = 8
): string {
    return getOrCreateId(localStorage, CLIENT_ID_KEY);
}

function getBrowserName(): string {
    const ua = navigator.userAgent.toLowerCase();
    if (ua.includes("chrome") && !ua.includes("edg") && !ua.includes("opr")) return "chrome";
    if (ua.includes("safari") && !ua.includes("chrome")) return "safari";
    if (ua.includes("firefox")) return "firefox";
    if (ua.includes("edg")) return "edge";
    return "unknown";
}
