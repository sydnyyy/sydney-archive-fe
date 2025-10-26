import { Geist, Geist_Mono, Poor_Story } from "next/font/google";

export const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

export const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const poorStory = Poor_Story({
    weight: "400",
    subsets: ["latin"],
    variable: "--font-poor-story",
});

export const fontVariables = `${geistSans.variable} ${geistMono.variable} ${poorStory.variable}`;