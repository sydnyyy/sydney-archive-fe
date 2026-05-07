"use client";

import { usePathname, useRouter } from "next/navigation";
import ActionTabs from "@/components/common/ActionTabs";
import { useChat } from "@/app/(home)/context/ChatContext";
import { useClient } from "@/app/(home)/context/ClientContext";
import UserChatView from "@/components/chat/user/UserChatView";
import { Item } from "@/lib/types/item/item";

interface LayoutWrapperProps {
    children: React.ReactNode;
    selectedItem?: Item | null;
}

export default function LayoutWrapper({ children, selectedItem = null }: LayoutWrapperProps) {
    const { isChatOpen, setIsChatOpen } = useChat();
    const { clientId } = useClient();
    const router = useRouter();
    const pathname = usePathname();

    const handleTabClick = (tab: string) => {
        if (tab === "chat") {
            setIsChatOpen(!isChatOpen);
            return;
        }

        const currentTab = pathname.split("/")[1] || "item";

        if (currentTab !== tab) {
            router.push(`/${tab}`);
        }
    };

    const path = pathname.split("/")[1];
    const activeTab = (() => {
        if (!path || path === "" || path === "item") return "item";
        return path;
    })();

    return (
        <>
            {children}

            <ActionTabs
                activeTab={activeTab}
                onTabClick={handleTabClick}
                isChatOpen={isChatOpen}
            />

            {isChatOpen && (
                <UserChatView
                    isChatOpen={isChatOpen}
                    setIsChatOpen={setIsChatOpen}
                    clientId={clientId}
                    selectedItem={selectedItem}
                />
            )}
        </>
    );
}

