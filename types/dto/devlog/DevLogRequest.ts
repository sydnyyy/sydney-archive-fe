import {VisibilityStatus} from "@/types/domain/common/VisibilityStatus";

export interface DevLogCreateRequest {
    title: string;
    description: string;

    visibilityStatus: VisibilityStatus;
}

export interface DevLogUpdateRequest {
    title: string;
    description: string;

    visibilityStatus: VisibilityStatus;
}