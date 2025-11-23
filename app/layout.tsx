import type { Metadata } from "next";
import "./globals.css";
import { fontVariables } from "./_shared/fonts";
import { ClientProvider } from "./context/ClientContext";
import { ChatProvider } from "./context/ChatContext";
import LayoutWrapper from "./LayoutWrapper";

export const metadata: Metadata = {
    title: "Wishlist",
    icons: { icon: "/tags/tag_heart_pin_right.svg" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ko">
            <body className={`${fontVariables} antialiased`}>
                <ClientProvider>
                    <ChatProvider>
                        <LayoutWrapper>{children}</LayoutWrapper>
                    </ChatProvider>
                </ClientProvider>
            </body>
        </html>
    );
}