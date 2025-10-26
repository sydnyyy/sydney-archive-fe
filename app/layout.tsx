import type { Metadata } from "next";
import "./globals.css";
import { fontVariables } from "./_shared/fonts";

export const metadata: Metadata = {
  title: "Wishlist",
  icons: {
      icon: "/wishlist_logo.svg"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ko">
        <body className={`${fontVariables} antialiased`}>
        {children}
        </body>
        </html>
    );
}