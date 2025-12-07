interface CalendarHeaderProps {
    year: number;
    month: number;
    onPrev: () => void;
    onNext: () => void;
}

export default function CalendarHeader({ year, month, onPrev, onNext }: CalendarHeaderProps) {
    return (
        <div className="flex justify-between items-center mb-4">
            <button
                onClick={onPrev}
                className="px-3 py-1 rounded-md transition"
                style={{
                    backgroundColor: "var(--color-btn-primary-bg)",
                    color: "var(--color-btn-primary-text)",
                }}
                onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "var(--color-btn-primary-hover-bg)")
                }
                onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "var(--color-btn-primary-bg)")
                }
            >
                ◀
            </button>

            <h2 className="text-lg font-semibold">
                {year}. {String(month).padStart(2, "0")}
            </h2>

            <button
                onClick={onNext}
                className="px-3 py-1 rounded-md transition"
                style={{
                    backgroundColor: "var(--color-btn-primary-bg)",
                    color: "var(--color-btn-primary-text)",
                }}
                onMouseEnter={(e) =>
                    (e.currentTarget.style.backgroundColor = "var(--color-btn-primary-hover-bg)")
                }
                onMouseLeave={(e) =>
                    (e.currentTarget.style.backgroundColor = "var(--color-btn-primary-bg)")
                }
            >
                ▶
            </button>
        </div>
    );
}
