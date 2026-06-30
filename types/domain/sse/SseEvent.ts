export enum SseEventType {
    CONNECTED = 'CONNECTED',
    LOGIN_SUCCEEDED = 'LOGIN_SUCCEEDED'
}

export type SsePayload = {
    message: string;
    version: number;
}