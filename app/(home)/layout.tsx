import type { Metadata } from "next";
import "../globals.css";
import { fontVariables } from "../_shared/fonts";
import { ClientProvider } from "@/app/(home)/context/ClientContext";
import { ChatProvider } from "@/app/(home)/context/ChatContext";
import MainNavigation from "@/components/common/MainNavigation";

export const metadata: Metadata = {
    title: "Wishlist",
    icons: { icon: "/tags/tag_heart_pin_right.svg" },
};

export default function HomeLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ko">
            <body className={`${fontVariables} antialiased`}>
                <ClientProvider>
                    <ChatProvider>
                        {children}
                        <MainNavigation />
                    </ChatProvider>
                </ClientProvider>
            </body>
        </html>
    );
}