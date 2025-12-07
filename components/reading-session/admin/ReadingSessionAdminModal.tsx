import ModalLayout from "@/components/common/ModalLayout";
import { ReadingSession } from "@/lib/types/reading-session.types";

interface Props {
    session: ReadingSession;
    onClose: () => void;
}

export default function ReadingSessionAdminModal({ session, onClose }: Props) {
    return (
        <ModalLayout onClose={onClose}>
            <div className="flex flex-col gap-2 p-3 w-full">
                <h2 className="text-lg font-semibold mb-2">{session.title}</h2>

                {session.imageUrl && (
                    <img
                        src={session.imageUrl}
                        alt={session.title}
                        className="rounded-md w-full"
                    />
                )}

                <p>저자: {session.author}</p>
                <p>시작일: {session.startDate}</p>
                <p>종료일: {session.endDate}</p>
                <p>미팅 날짜: {session.meetingDate}</p>
                <p>상태: {session.readingSessionStatus}</p>

                <button
                    className="
                        w-full py-2 rounded mt-2
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
                    상태 변경
                </button>
            </div>
        </ModalLayout>
    );
}
