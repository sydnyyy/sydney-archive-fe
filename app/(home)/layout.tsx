import type { Metadata } from "next";
import "../globals.css";
import { fontVariables } from "../_shared/fonts";
import MainNavigation from "@/components/common/MainNavigation";
import AuthProvider from "@/app/providers/AuthProvider";
import { ChatProvider } from "@/app/(home)/context/ChatContext";

export const metadata: Metadata = {
    title: "tfl",
    icons: { icon: "/tags/tag_heart_pin_right.svg" },
};

export default function HomeLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ko">
            <body className={`${fontVariables} antialiased`}>
                <AuthProvider>
                    <ChatProvider>
                        {children}
                        <MainNavigation />
                    </ChatProvider>
                </AuthProvider>
            </body>
        </html>
    );
}