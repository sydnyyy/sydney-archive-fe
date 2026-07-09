import type { Metadata } from "next";
import "../globals.css";
import { fontVariables } from "../_shared/fonts";
import MainNavigation from "@/components/common/MainNavigation";
import AuthProvider from "@/app/providers/user/AuthProvider";
import Header from "@/components/layout/Header";

export const metadata: Metadata = {
    title: "sydney archive",
    icons: { icon: "/tags/tag_heart_pin_right.svg" },
};

export default function HomeLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className={`${fontVariables} antialiased`}>
            <AuthProvider>
                <div className="h-screen overflow-hidden">
                    <main className="h-full">
                        <div className="w-full max-w-[540px] h-full mx-auto flex flex-col p-3">
                            <div className="mt-5 mr-4 mb-5">
                                <Header />
                            </div>
                            {children}
                        </div>
                    </main>
                    <MainNavigation />
                </div>
            </AuthProvider>
        </div>
    );
}