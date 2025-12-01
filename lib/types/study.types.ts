export interface BookSession {
    id: string;
    imageUrl?: string;
    title: string;
    author: string;
    period: string;
    meetingDate: string;
    purchaseLink?: string;
    currentReservations?: number;
}