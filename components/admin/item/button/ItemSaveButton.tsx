import { CheckIcon } from "@heroicons/react/24/outline"

interface ItemSaveButtonProps {
    onSave: () => void;
}

export default function ItemSaveButton({ onSave }: ItemSaveButtonProps) {
    return (
      <button
          onClick={onSave}
          className="flex items-center justify-center px-7 py-2 border rounded transition gap-3"
      >
          <CheckIcon className="h-5 w-5" />
      </button>
    );
}