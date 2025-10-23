"use client";

import { useEffect, useState } from "react";

interface SystemEventDialogProps {
    onDecision: (shouldTerminate: boolean) => void;
}

export default function SystemEventDialog({ onDecision }: SystemEventDialogProps) {
    const [countdown, setCountdown] = useState(15);

    useEffect(() => {
        if (countdown <= 0) {
            onDecision(true);
            return;
        }
        const timer = setTimeout(() => setCountdown(c => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [countdown, onDecision]);

    return (
        <div
            style={{
                position: "fixed",
                top: 0,
                left: 0,
                width: "100vw",
                height: "100vh",
                backgroundColor: "rgba(0,0,0,0.3)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 2000
            }}
        >
            <div
                style={{
                    backgroundColor: "white",
                    padding: "20px",
                    borderRadius: "12px",
                    minWidth: "280px",
                    textAlign: "center",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.2)"
            }}>
                <p style={{ marginBottom: "3px", color: "#6c757d", fontSize: "14px" }}>
                관리자의 응답을 계속 기다리시겠습니까?<br/>
                </p>
                <p style={{ fontSize: "12px", color: "#a0a0a0", marginBottom: "10px" }}>
                    {countdown}초 후 자동 종료됩니다.
                </p>
                <div style={{ display: "flex", justifyContent: "space-around", gap: "12px" }}>
                    <button
                        onClick={() => onDecision(true)}
                        style={{
                            flex: 1,
                            padding: "11px 0",
                            borderRadius: "8px",
                            border: "none",
                            backgroundColor: "#6CA67C",
                            color: "white",
                            fontSize: "14px",
                            fontWeight: 450,
                            cursor: "pointer"
                        }}
                    >
                        종료
                    </button>
                    <button
                        onClick={() => onDecision(false)}
                        style={{
                            flex: 1,
                            padding: "11px 0",
                            borderRadius: "8px",
                            border: "1px solid #6CA67C",
                            backgroundColor: "white",
                            color: "#6CA67C",
                            fontSize: "14px",
                            fontWeight: 450,
                            cursor: "pointer"
                        }}
                    >
                        유지
                    </button>
                </div>
            </div>
        </div>
    );
}