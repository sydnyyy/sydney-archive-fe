import { Suspense } from "react";
import OAuthSuccessPage from "@/app/admin/oauth/success/OAuthSuccessClient";

export default function Page() {
    return (
        <Suspense fallback={null}>
            <OAuthSuccessPage />
        </Suspense>
    );
}