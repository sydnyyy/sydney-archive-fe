export interface ReadingSession {
    id: string;

    imageUrl?: string;
    title: string;
    author: string;

    startDate: string;
    endDate: string;
    meetingAt: string;

    readingSessionStatus: string;

    purchaseLink?: string;
    currentReservations?: number;
}