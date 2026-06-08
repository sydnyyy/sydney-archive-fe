import {Item, ITEM_TYPE} from "@/types/domain/item/item";
import ModalLayout from "@/components/common/ModalLayout";
import ImageCarousel from "@/components/common/ImageCarousel";
import { useState } from "react";
import {useAdminAuth} from "@/app/providers/AdminAuthProvider";
import {createItemApi, deleteItemApi, updateItemApi} from "@/lib/api/item/item.command";
import {ItemCreateRequest, ItemUpdateRequest} from "@/types/dto/item/ItemRequest";
import CloseButton from "@/components/common/button/CloseButton";
import ItemSaveButton from "@/components/admin/item/button/ItemSaveButton";
import ItemUpdateButton from "@/components/admin/item/button/ItemUpdateButton";
import ItemDeleteButton from "@/components/admin/item/button/ItemDeleteButton";
import ItemCancelButton from "@/components/admin/item/button/ItemCancelButton";

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
        itemType: item?.itemType || ITEM_TYPE.PRODUCT,
        title: item?.title || "",
        description: item?.description || "",
        imageUrls: item?.imageUrls || [],
        thumbnailIndex: item?.thumbnailIndex || 0,
        permission: item?.permission || { canEdit: true, canDelete: true }
    });

    const { accessToken } = useAdminAuth();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
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
            alert("세션이 만료되었습니다. 재로그인이 필요합니다.");
            return;
        }

        try {
            let savedItem: Item;

            if (isCreateMode) {
                const requestBody: ItemCreateRequest = {
                    itemType: formData.itemType,
                    title: formData.title || undefined,
                    description: formData.description || "",
                    imageUrls: formData.imageUrls,
                    thumbnailIndex: formData.thumbnailIndex,
                };

                savedItem = await createItemApi(requestBody, accessToken);
            }
            else {
                const requestBody: ItemUpdateRequest = {
                    itemType: formData.itemType,
                    title: formData.title || undefined,
                    description: formData.description || "",
                    imageUrls: formData.imageUrls,
                    thumbnailIndex: formData.thumbnailIndex,
                };

                savedItem = await updateItemApi(currentItem.itemId, requestBody, accessToken);
            }

            setCurrentItem(savedItem);
            setFormData(savedItem);
            setIsEditMode(false);

            alert("아이템이 저장되었습니다");
            onDataChange?.();
        } catch (error) {
            console.error("저장 실패:", error);
            alert("저장 중 오류가 발생했습니다.");
        }
    };

    const handleDelete = async () => {
        if (!accessToken) {
            alert("세션이 만료되었습니다. 재로그인이 필요합니다.");
            return;
        }

        if (!currentItem) {
            alert("삭제 아이템이 선택되지 않았습니다.");
            return;
        }

        const isConfirmed = confirm("아이템이 삭제됩니다.");
        if (isConfirmed) {
            try {
                await deleteItemApi(currentItem?.itemId, accessToken);
                alert("삭제되었습니다.");
                onDataChange?.();
            } catch (error) {
                console.error("삭제 실패:", error);
                alert("삭제 중 오류가 발생했습니다.");
            } finally {
                onClose();
            }
        } else {
            alert("취소되었습니다.");
            return;
        }
    };

    return (
        <ModalLayout onClose={onClose}>
            <div className="flex flex-col gap-1.5 w-full">

                <div className="flex flex-col pl-3 pt-3">
                    <CloseButton onClose={onClose} />
                </div>

                <div className="flex flex-col gap-1 px-1.5 pt-2">
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
                            <div className="text-sm whitespace-pre-line py-1">
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

                <div className="mt-4 flex gap-2 justify-end p-2">
                    {isEditMode ? (
                        <>
                            {!isCreateMode && <ItemCancelButton onCancel={handleCancel} />}
                            <ItemSaveButton onSave={handleSave} />
                        </>
                    ) : (
                        <>
                            <ItemUpdateButton onUpdate={() => {setIsEditMode(true)}}/>
                            <ItemDeleteButton onDelete={handleDelete} />
                        </>
                    )}
                </div>

            </div>
        </ModalLayout>
    )
}