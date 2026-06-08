import {XMarkIcon} from "@heroicons/react/24/outline"

interface ItemCancelButtonProps {
    onCancel: () => void;
}

export default function ItemCancelButton({ onCancel }: ItemCancelButtonProps) {
    return (
        <button
            onClick={onCancel}
            className="flex items-center justify-center px-7 py-2 border rounded transition gap-3"
        >
            <XMarkIcon className="h-5 w-5" />
        </button>
    );
}