"use client";

import { useState } from "react";

import ReadingSessionPage from "@/components/reading-session/user/ReadingSessionPage";

export default function StudyPage() {
    const [isReadWithMeModalOpen, setIsReadWithMeModalOpen] = useState(false);

    const modals = [
        { id: "m1", title: "Read with me", type: "read" },
        { id: "m2", title: "Study with me", type: "study" },
        { id: "m3", title: "Content Modal", type: "content" },
        { id: "m4", title: "Content Modal", type: "content" },
    ];

    return (
        <div className="min-h-screen flex flex-col relative">
            <main className="flex flex-1 justify-center items-start p-6 relative">
                <div className="w-full max-w-[540px] mx-auto">
                    {/* 메인 문구 (스크롤되면서 사라짐) */}
                    <div className="p-6 leading-relaxed text-sm text-right">
                        내 위시리스트야<br />
                        네가 경험했으면 하는 내 위시리스트<br />
                        네가 소소한 행복에도 잘 살아갔으면 좋겠어<br />
                        그것 또한 내 위시리스트야
                    </div>

                    <div className="w-full grid gap-1.5 grid-cols-4">
                        {modals.map((modal) => (
                            <div
                                key={modal.id}
                                className="
                                    w-full aspect-square rounded-lg bg-[var(--color-bg-main)]
                                    border border-[var(--color-text-primary)] cursor-pointer
                                    flex items-center justify-center text-[var(--color-text-primary)] font-medium"
                                onClick={() => {
                                    if (modal.type === "read") setIsReadWithMeModalOpen(true);
                                    else alert(`${modal.title} 기능 클릭`);
                                }}
                            >
                                {modal.title}
                            </div>
                        ))}
                    </div>

                    {isReadWithMeModalOpen && (
                        <ReadingSessionPage onClose={() => setIsReadWithMeModalOpen(false)} />
                    )}
                </div>
            </main>
        </div>
    );
}