import "../globals.css";
import { fontVariables } from "../_shared/fonts";
import AdminMainNavigation from "@/components/admin/navigation/AdminMainNavigation";
import AdminAuthProvider from "@/app/providers/AdminAuthProvider";

export const dynamic = "force-dynamic";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className={`${fontVariables} antialiased`}>
            <AdminAuthProvider>
                {children}
                <AdminMainNavigation />
            </AdminAuthProvider>
        </div>
    );
}