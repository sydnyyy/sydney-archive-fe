import ModalLayout from "@/components/common/ModalLayout";
import { ReadingSession } from "@/lib/types/reading-session.types";

interface Props {
    session: ReadingSession;
    onClose: () => void;
}

export default function ReadingSessionAdminDetailModal({ session, onClose }: Props) {
    return (
        <ModalLayout
            onClose={onClose}
            widthClass="w-[660px]"
        >

            <div className="flex gap-4 p-3 w-full">
                {session.imageUrl && (
                    <div className="w-1/3 shrink-0">
                        <img
                            src={session.imageUrl}
                            alt={session.title}
                            className="rounded-md w-full"
                        />
                    </div>
                )}

                <div className="flex flex-col gap-2 w-2/3">
                    <p className="text-lg font-semibold">{session.title}</p>
                    <p>저자 {session.author}</p>
                    <p>상태 {session.readingSessionStatus}</p>
                    <p>기간 {session.startDate} ~ {session.endDate}</p>
                    <p>미팅 날짜 {session.meetingAt}</p>
                    <p>설명 {session.description}</p>

                    <div className="mt-auto flex gap-2 pt-4">
                        <button
                            className="
                                w-full py-2 rounded
                                transition-colors duration-200
                                bg-[var(--color-bg-main)]
                                hover:bg-[var(--color-bg-hover)]
                            "
                            onClick={() => alert("수정 기능 호출 예정")}
                        >
                            수정
                        </button>

                        <button
                            className="
                                w-full py-2 rounded
                                transition-colors duration-200
                                bg-[var(--color-bg-main)]
                                hover:bg-[var(--color-bg-hover)]
                            "
                            onClick={() => alert("상태 변경 기능 호출 예정")}
                        >
                            세션 취소 / 완료
                        </button>
                    </div>
                </div>
            </div>
        </ModalLayout>
    );
}
