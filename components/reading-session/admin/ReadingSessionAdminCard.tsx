import { ReadingSession } from "@/lib/types/reading-session.types";

interface Props {
    session: ReadingSession;
    onClick: () => void;
}

export default function ReadingSessionAdminCard({ session, onClick }: Props) {
    return (
        <div
            className="
                border p-3 rounded-lg cursor-pointer
                flex gap-4
                transition-transform duration-200 ease-in-out
                hover:-translate-y-1 hover:shadow-md
            "
            style={{ borderColor: "var(--color-border-primary)" }}
            onClick={onClick}
        >
            {/* 왼쪽: 이미지 */}
            {session.imageUrl ? (
                <img
                    src={session.imageUrl}
                    alt={session.title}
                    className="w-24 h-24 object-cover rounded"
                />
            ) : (
                <div className="w-24 h-24 rounded flex items-center justify-center text-xs">
                    이미지 없음
                </div>
            )}

            {/* 오른쪽: 세부 정보 */}
            <div className="flex flex-col flex-1 gap-2">
                {/* 상단: 제목 + 저자 + 상태 */}
                <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-lg">{session.title} - {session.author} 저자</h3>
                    <span className="text-sm font-semibold px-2 py-1 rounded">
                        {session.readingSessionStatus}
                    </span>
                </div>

                {/* 하단: 기간, 예약자 */}
                <div className="text-sm">
                    <p>기간 {session.startDate} ~ {session.endDate}</p>
                    <p>미팅 {session.meetingAt}</p>
                    <p>예약자 {session.currentReservations || 0}명</p>
                </div>
            </div>
        </div>
    );
}