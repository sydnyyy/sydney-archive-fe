import { PencilSquareIcon } from "@heroicons/react/24/outline"

interface ItemUpdateButtonProps {
    onUpdate: () => void;
}

export default function ItemUpdateButton({ onUpdate }: ItemUpdateButtonProps) {
    return (
        <button
            onClick={onUpdate}
            className="flex items-center justify-center px-7 py-2 border rounded transition gap-3"
        >
            <PencilSquareIcon className="h-5 w-5" />
        </button>
    );
}