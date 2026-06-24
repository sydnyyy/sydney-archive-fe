export interface LoginSession {
    qrCodeBase64: string;
    sid: string;
    expiredAt: number;
}