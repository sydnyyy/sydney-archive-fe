import {useEffect, useRef} from "react";
import {SseEventType, SsePayload} from "@/types/domain/sse/SseEvent";
import {useAdminAuth} from "@/app/providers/AdminAuthProvider";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;

export const useSse = (
    sid: string | undefined
) => {

    const eventSourceRef = useRef<EventSource | null>(null);
    const { completeLoginSessionAndLoginSync } = useAdminAuth();

    const handleEvent = (
        eventType: string,
        event: MessageEvent
    ) => {
        const data: SsePayload = JSON.parse(event.data);

        switch (eventType) {
            case SseEventType.CONNECTED:
                if (data.version > 0 && sid) {
                    completeLoginSessionAndLoginSync(sid, data.version);
                }
                break;

            case SseEventType.LOGIN_SUCCEEDED:
                if (data.version > 0 && sid) {
                    completeLoginSessionAndLoginSync(sid, data.version);
                }
                break;
        }
    };

    const disconnectSse = () => {
        if (eventSourceRef.current) {
            eventSourceRef.current.close();
            eventSourceRef.current = null;
            console.log(`[SSE] SSE close. sid=${sid}`, sid);
        }
    };

    useEffect(() => {
        if (!sid) {
            disconnectSse();
            return;
        }

        const eventSource = new EventSource(`${API_BASE_URL}/api/sse/connect?sid=` + sid);
        eventSourceRef.current = eventSource;

        eventSource.onopen = () => {
            console.log('SSE connected');
        };

        eventSource.addEventListener(SseEventType.CONNECTED, (event) => {
            console.log(`[SSE] CONNECTED. sid=${sid}`);
            handleEvent(SseEventType.CONNECTED, event as MessageEvent);
        });

        eventSource.addEventListener(SseEventType.LOGIN_SUCCEEDED, (event) => {
            console.log(`[SSE] LOGIN_SUCCEEDED. sid=${sid}`);
            handleEvent(SseEventType.LOGIN_SUCCEEDED, event as MessageEvent);
        });

        eventSource.onerror = (error) => {
            console.error('SSE error:', error);
        };

        return () => {
            disconnectSse();
        };
    }, [sid]);
};