export interface SystemEvent {
    type: string;
    clientId: string;
    sessionId: string;
    shouldTerminate: boolean;
}