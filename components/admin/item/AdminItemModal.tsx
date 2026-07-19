import {Item} from "@/types/domain/item/item";
import ModalLayout from "@/components/common/ModalLayout";
import ImageCarousel from "@/components/item/ImageCarousel";
import { useState } from "react";
import {useAdminAuth} from "@/app/providers/admin/AdminAuthProvider";
import {createItemApi, deleteItemApi, updateItemApi} from "@/lib/api/admin/item/item.command";
import {ItemCreateRequest, ItemUpdateRequest} from "@/types/dto/item/ItemRequest";
import {VISIBILITY_STATUS} from "@/types/domain/common/VisibilityStatus";
import VisibilityToggleButton from "@/components/common/button/VisibilityToggleButton";
import {CheckIcon, PencilSquareIcon, TrashIcon, XMarkIcon} from "@heroicons/react/24/outline";

interface AdminItemModalProps {
    item?: Item | null;
    onClose: () => void;
    onDataChange: () => void;
}

export default function AdminItemModal({
                                           item,
                                           onClose,
                                           onDataChange
}: AdminItemModalProps) {

    const [currentItem, setCurrentItem] = useState<Item | null>(item || null);

    const isCreateMode = !currentItem;
    const [isEditMode, setIsEditMode] = useState(isCreateMode);

    const [formData, setFormData] = useState<Item>({
        itemId: item?.itemId || "",
        title: item?.title || "",
        description: item?.description || "",
        imageUrls: item?.imageUrls || [],
        thumbnailIndex: item?.thumbnailIndex || 0,
        permission: item?.permission || { canEdit: true, canDelete: true },
        visibilityStatus: item?.visibilityStatus || VISIBILITY_STATUS.PRIVATE
    });

    const { accessToken, refreshAccessToken } = useAdminAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleToggleVisibility = async () => {
        const nextStatus = formData.visibilityStatus === 'PUBLIC' ? VISIBILITY_STATUS.PRIVATE : VISIBILITY_STATUS.PUBLIC;
        setFormData((prev) => ({ ...prev, visibilityStatus: nextStatus }));
    };

    const handleCancel = () => {
        if (isCreateMode) {
            onClose();
        } else if (currentItem) {
            setFormData({ ...currentItem });
            setIsEditMode(false);
        }
    };

    const handleSave = async () => {
        if (!accessToken) {
            console.error("Access token is missing. The operation failed.");
            return;
        }

        try {
            let savedItem: Item;

            if (isCreateMode) {
                const requestBody: ItemCreateRequest = {
                    title: formData.title || undefined,
                    description: formData.description || "",
                    imageUrls: formData.imageUrls,
                    thumbnailIndex: formData.thumbnailIndex,
                    visibilityStatus: formData.visibilityStatus
                };

                savedItem = await createItemApi(requestBody, accessToken, refreshAccessToken);
            }
            else {
                const requestBody: ItemUpdateRequest = {
                    title: formData.title || undefined,
                    description: formData.description || "",
                    imageUrls: formData.imageUrls,
                    thumbnailIndex: formData.thumbnailIndex,
                    visibilityStatus: formData.visibilityStatus
                };

                savedItem = await updateItemApi(currentItem.itemId, requestBody, accessToken, refreshAccessToken);
            }

            setCurrentItem(savedItem);
            setFormData(savedItem);
            setIsEditMode(false);

            alert("아이템이 저장되었습니다");
            onDataChange?.();
        } catch (error) {
            console.error(error);
            alert(error);
        }
    };

    const handleDelete = async () => {
        if (!accessToken) {
            console.error("Access token is missing. The operation failed.");
            return;
        }

        if (!currentItem) {
            alert("삭제 아이템이 선택되지 않았습니다.");
            return;
        }

        const isConfirmed = confirm("아이템울 삭제합니다.");
        if (isConfirmed) {
            try {
                await deleteItemApi(currentItem?.itemId, accessToken, refreshAccessToken);
                alert("삭제되었습니다.");
                onDataChange?.();
            } catch (error) {
                console.error(error);
                alert(error);
            } finally {
                onClose();
            }
        }
    };

    return (
        <ModalLayout onClose={onClose}>
            <div className="flex flex-col gap-3 w-full px-2 py-2">

                <div className="flex justify-end">
                    {isEditMode ? (
                        <VisibilityToggleButton
                            status={formData.visibilityStatus}
                            onToggle={handleToggleVisibility}
                        />
                    ) : (
                        currentItem?.visibilityStatus && (
                            <p> {currentItem.visibilityStatus} </p>
                        )
                    )}
                </div>

                <div>
                    {isEditMode ? (
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleChange}
                            className="border p-2 rounded w-full min-h-[100px] whitespace-pre-line"
                            placeholder="설명을 입력하세요"
                        />
                    ) : (
                        currentItem?.description && (
                            <div className="whitespace-pre-line">
                                {currentItem.description}
                            </div>
                        )
                    )}
                </div>

                {!isCreateMode && currentItem?.imageUrls && (
                    <ImageCarousel
                        images={currentItem.imageUrls}
                        thumbnailIndex={currentItem.thumbnailIndex}
                    />
                )}

                <div className="flex gap-2 justify-end">
                    {isEditMode ? (
                        <>
                            {!isCreateMode && (
                                <button
                                    onClick={handleCancel}
                                    className="flex items-center justify-center px-6 py-1.5 border rounded-xl"
                                >
                                    <XMarkIcon className="h-5 w-5" />
                                </button>
                            )}

                            <button
                                onClick={handleSave}
                                className="flex items-center justify-center px-6 py-1.5 border rounded-xl"
                            >
                                <CheckIcon className="h-5 w-5" />
                            </button>
                        </>
                    ) : (
                        <>
                            <button
                                onClick={() => {setIsEditMode(true)}}
                                className="flex items-center justify-center px-6 py-1.5 border rounded-xl"
                            >
                                <PencilSquareIcon className="h-5 w-5" />
                            </button>

                            <button
                                onClick={handleDelete}
                                className="flex items-center justify-center px-6 py-1.5 border rounded-xl"
                            >
                                <TrashIcon className="h-5 w-5" />
                            </button>
                        </>
                    )}
                </div>

            </div>
        </ModalLayout>
    )
}