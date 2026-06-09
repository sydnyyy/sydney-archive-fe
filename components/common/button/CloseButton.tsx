import {ArrowLeftIcon} from "@heroicons/react/24/outline"

interface ItemCloseButtonProps {
    onClose: () => void;
}

export default function CloseButton({ onClose }: ItemCloseButtonProps) {
    return (
        <button onClick={onClose}>
            <ArrowLeftIcon className="h-5 w-5" />
        </button>
    );
}