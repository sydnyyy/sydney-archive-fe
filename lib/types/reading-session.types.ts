export interface ReadingSession {
    id: string;

    imageUrl?: string;
    title: string;
    author: string;

    startDate: string;
    endDate: string;
    meetingDate: string;

    readingSessionStatus: string;

    purchaseLink?: string;
    currentReservations?: number;
}