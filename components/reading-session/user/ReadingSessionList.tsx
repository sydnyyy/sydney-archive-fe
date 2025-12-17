"use client";

import { useState } from "react";
import ReadingItemCard from "./ReadingItemCard";
import { ReadingSession } from "@/lib/types/reading-session.types";

interface ReadingSessionListProps {
    sessions: ReadingSession[];
}

export default function ReadingSessionList({ sessions }: ReadingSessionListProps) {
    const [selectedSession, setSelectedSession] = useState<ReadingSession | null>(null);

    return (
        <div className="flex flex-col gap-2 w-full">
            {sessions.map((session) => {
                const isSelected = selectedSession?.id === session.id;

                return (
                    <div key={session.id} className="flex flex-col gap-0">
                        <ReadingItemCard
                            session={session}
                            onSelect={() =>
                                setSelectedSession(isSelected ? null : session)
                            }
                            isSelected={isSelected}
                        />
                    </div>
                );
            })}
        </div>
    );
}