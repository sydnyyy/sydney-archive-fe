import "../globals.css";
import { fontVariables } from "../_shared/fonts";

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className={`${fontVariables} antialiased`}>
            {children}
        </div>
    );
}