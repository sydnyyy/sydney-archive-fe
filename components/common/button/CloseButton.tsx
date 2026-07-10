import {ArrowLeftIcon} from "@heroicons/react/24/outline"

interface ItemCloseButtonProps {
    onClose: () => void;
}

export default function CloseButton({ onClose }: ItemCloseButtonProps) {
    return (
        <button onClick={onClose}>
            <ArrowLeftIcon className="h-6 w-6" />
        </button>
    );
}