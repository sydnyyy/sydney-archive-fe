import type { Metadata } from "next";
import "../globals.css";
import { fontVariables } from "../_shared/fonts";
import MainNavigation from "@/components/common/MainNavigation";
import AuthProvider from "@/app/providers/user/AuthProvider";

export const metadata: Metadata = {
    title: "sydney archive",
    icons: { icon: "/tags/tag_heart_pin_right.svg" },
};

export default function HomeLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className={`${fontVariables} antialiased`}>
            <AuthProvider>
                {children}
                <MainNavigation />
            </AuthProvider>
        </div>
    );
}