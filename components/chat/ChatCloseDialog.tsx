interface ChatCloseDialogProps {
    onConfirm: (shouldClose: boolean) => void;
}

export default function ChatCloseDialog({ onConfirm }: ChatCloseDialogProps) {
    return (
        <div style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.3)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 2000 }}
        >
            <div style={{
                backgroundColor: "white",
                padding: "20px",
                borderRadius: "12px",
                minWidth: "280px",
                textAlign: "center",
                boxShadow: "0 8px 24px rgba(0,0,0,0.2)" }}
            >
                <p style={{ marginBottom: "13px", color: "#6c757d", fontSize: "14px" }}>
                    상담을 종료하시겠습니까?<br/>
                    <strong>유지</strong> 선택 시 창은 닫히지만, 채팅 내용은 그대로 남습니다.
                </p>
                <div style={{ display: "flex", justifyContent: "space-around", gap: "12px" }}>
                    <button
                        onClick={() => onConfirm(true)}
                        style={{
                            flex: 1,
                            padding: "11px 0",
                            borderRadius: "8px",
                            border: "none",
                            backgroundColor: "#4599E6",
                            color: "white",
                            fontSize: "14px",
                            fontWeight: 450,
                            cursor: "pointer" }}
                    >
                        종료
                    </button>
                    <button
                        onClick={() => onConfirm(false)}
                        style={{
                            flex: 1,
                            padding: "11px 0",
                            borderRadius: "8px",
                            border: "1px solid #4599E6",
                            backgroundColor: "white",
                            color: "#4599E6",
                            fontSize: "14px",
                            fontWeight: 450,
                            cursor: "pointer" }}
                    >
                        유지
                    </button>
                </div>
            </div>
        </div>
    );
}
