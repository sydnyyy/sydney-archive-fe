export interface SystemEvent {
    type: string;
    sid: string;
    sessionId: string;
    shouldTerminate: boolean;
}