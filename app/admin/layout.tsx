import "../globals.css";
import { fontVariables } from "../_shared/fonts";

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <html lang="ko">
        <body className={`${fontVariables} antialiased`}>
        {children}
        </body>
        </html>
    );
}