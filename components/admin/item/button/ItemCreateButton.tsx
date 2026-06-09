import { PlusIcon } from "@heroicons/react/24/outline"

interface ItemCreateButtonProps {
    onCreate: () => void;
}

export default function ItemCreateButton({ onCreate }: ItemCreateButtonProps) {
    return (
        <button onClick={onCreate} >
            <PlusIcon className="h-5 w-5" />
        </button>
    );
}