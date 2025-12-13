import ReadingSessionAdminCard from "./ReadingSessionAdminCard";
import { ReadingSession } from "@/lib/types/reading-session.types";

interface Props {
    sessions: ReadingSession[];
    onSelect: (s: ReadingSession) => void;
}

export default function ReadingSessionAdminList({ sessions, onSelect }: Props) {
    return (
        <div className="flex flex-col gap-3">
            {sessions.map((session) => (
                <ReadingSessionAdminCard
                    key={session.id}
                    session={session}
                    onClick={() => onSelect(session)}
                />
            ))}
        </div>
    );
}
