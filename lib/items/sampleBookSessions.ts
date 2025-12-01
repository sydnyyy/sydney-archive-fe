import { BookSession } from "@/lib/types/study.types";

export const sampleSessions: BookSession[] = [
    {
        id: "s1",
        title: "소설 A",
        author: "작가 A",
        period: "2025.12.01 ~ 2025.12.07",
        meetingDate: "2025-12-10",
        imageUrl: "/items/IMG_7507.jpeg",
        purchaseLink: "https://bookstore.com/book-a",
        currentReservations: 3,
    },
    {
        id: "s2",
        title: "철학 B",
        author: "작가 B",
        period: "2025.12.05 ~ 2025.12.12",
        meetingDate: "2025-12-12",
        imageUrl: "/items/IMG_2.jpeg",
        purchaseLink: "https://bookstore.com/book-b",
        currentReservations: 1,
    },
    {
        id: "s3",
        title: "에세이 C",
        author: "작가 C",
        period: "2025.12.10 ~ 2025.12.15",
        meetingDate: "2025-12-15",
        imageUrl: "/items/IMG_7507.jpeg",
        purchaseLink: "https://bookstore.com/book-c",
        currentReservations: 0,
    },
];
