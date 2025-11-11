interface ChatButtonProps {
    onClick: () => void;
}

export default function ChatButton({ onClick }: ChatButtonProps) {
    return (
        <div
            style={{
                position: "fixed",
                bottom: "40px",
                right: "25px",
                cursor: "pointer",
                width: "60px",
                height: "60px",
                borderRadius: "50%",
                backgroundColor: "white",
                boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                zIndex: 1000,
            }}
            onClick={onClick}
        >
            <img
                src="/wishlist_logo.svg"
                alt="Chat Icon"
                style={{ width: "40px", height: "40px" }}
            />
        </div>
    );
}
