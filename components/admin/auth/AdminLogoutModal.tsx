import ModalLayout from "@/components/common/ModalLayout";
import { useState } from "react";
import { useAdminAuth } from "@/app/providers/AdminAuthProvider";
import {Spinner} from "@/components/common/Spinner";

interface AdminLogoutModalProps {
    onClose: () => void;
}

export default function AdminLogoutModal({ onClose }: AdminLogoutModalProps) {
    const [isProcessing, setIsProcessing] = useState<boolean>(false);
    const { logout } = useAdminAuth();

    const handleLogoutSubmit = async () => {
        try {
            setIsProcessing(true);
            logout();
        } catch (err) {
            console.error(err);
        } finally {
            setIsProcessing(false);
            onClose();
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <ModalLayout
                widthClass="w-[350px]"
                scrollable={false}
            >
                <div className="flex flex-col gap-5 p-6">
                    <h2 className="text-center text-lg font-bold">관리자 로그아웃</h2>
                    <div className="flex-1 flex flex-col justify-center items-center">
                        {isProcessing ? (
                            <div className="flex items-center justify-center">
                                <Spinner />
                            </div>
                        ) : (
                            <button
                                onClick={handleLogoutSubmit}
                                disabled={isProcessing}
                                className="w-full py-3 px-4 rounded-xl font-medium text-white bg-red-500 hover:bg-red-600 transition-colors duration-200"
                            >
                                로그아웃
                            </button>
                        )}
                    </div>

                    <button
                        onClick={onClose}
                        disabled={isProcessing}
                        className="text-sm text-[var(--color-text-secondary)] underline"
                    >
                        취소
                    </button>
                </div>
            </ModalLayout>
        </div>
    );
}