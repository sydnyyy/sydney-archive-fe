import {VisibilityStatus} from "@/types/domain/common/VisibilityStatus";

export interface DevLog {
    id: string;

    title: string;
    description: string;

    visibilityStatus: VisibilityStatus;
    permission: Permission;
}