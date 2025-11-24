import { BaseItem, CATEGORY, ITEM_TYPE } from "@/lib/types/item.types";


export const recipeItems: BaseItem[] = [
    {
        id: "4",
        category: CATEGORY.FOOD,
        type: ITEM_TYPE.RECIPE,
        title: "수육",
        image: "/items/IMG_4.jpeg",
        description: `
            <b>조리 시간</b><br>
            총 조리 시간 약 45분<br><br>

            <b>재료</b><br>
            앞다리살(or 삼겹살), 된장, 양파, 마늘<br><br>

            <b>조리 방법</b><br>
            1. 돼지고기 초벌하고 (선택 ✅)<br>
            2. 🔥 끓는 물에 모든 재료를 10분 삶다가<br>
            3. 35분 이상 약중불에서 삶고 먹기
        `
    },
]