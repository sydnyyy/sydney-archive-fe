import ModalLayout from "@/components/common/ModalLayout";
import OAuth2ProviderButton from "@/components/admin/auth/OAuth2ProviderButton";

interface AdminLoginModalProps {
    onClose?: () => void;
}

export default function AdminLoginModal({ onClose }: AdminLoginModalProps) {

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <ModalLayout
                widthClass="w-[350px]"
                scrollable={false}
            >
                <div className="flex flex-col gap-5 p-6">
                    <div className="text-center">
                        <h2 className="text-lg font-bold">관리자 로그인</h2>
                    </div>

                    <div className="flex-1 flex flex-col justify-center items-center">
                        <OAuth2ProviderButton
                            provider="naver"
                            imageSrc="/icons/NAVER_login_Dark_KR_green_narrow_H48.png"
                            alt="네이버 로그인"
                        />
                    </div>

                    {onClose && (
                        <button
                            onClick={onClose}
                            className="text-sm text-[var(--color-text-secondary)] underline"
                        >
                            닫기
                        </button>
                    )}
                </div>
            </ModalLayout>
        </div>
    );
}