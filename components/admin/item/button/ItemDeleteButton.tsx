import { TrashIcon } from "@heroicons/react/24/outline"

interface ItemDeleteButtonProps {
    onDelete: () => void;
}

export default function ItemDeleteButton({ onDelete }: ItemDeleteButtonProps) {
    return (
        <button
            onClick={onDelete}
            className="flex items-center justify-center px-7 py-1.5 border rounded transition gap-3"
        >
            <TrashIcon className="h-5 w-5" />
        </button>
    );
}