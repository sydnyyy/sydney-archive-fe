import {VISIBILITY_STATUS, VisibilityStatus} from "@/types/domain/common/VisibilityStatus";
import {Eye, EyeOff} from "lucide-react";

interface VisibilityToggleButtonProps {
    status: VisibilityStatus;
    onToggle: () => void;
}

export default function VisibilityToggleButton({ status, onToggle }: VisibilityToggleButtonProps) {
    const isPublic = status === 'PUBLIC';
    return (
        <button
            onClick={onToggle}
            type="button"
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium text-sm transition-colors duration-200 border
                ${isPublic 
                ? 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100'
                : 'bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100'
            }`}
        >
            {isPublic ? (
                <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>{VISIBILITY_STATUS.PUBLIC}</span>
                </>
            ) : (
                <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>{VISIBILITY_STATUS.PRIVATE}</span>
                </>
            )}
        </button>
    );
}