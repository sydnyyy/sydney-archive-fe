import { Dispatch, SetStateAction } from "react";
import { CATEGORY, CategoryType } from "@/lib/types";

export const categories = [
    { label: CATEGORY.PRODUCT, icon: "🎁" },
    { label: CATEGORY.FOOD, icon: "🍕" },
] as const;

interface CategoryTabsProps {
    activeCategory: CategoryType;
    setActiveCategory: Dispatch<SetStateAction<CategoryType>>;
}

export default function CategoryTabs({
                                         activeCategory,
                                         setActiveCategory }: CategoryTabsProps) {
    return (
        <aside className="flex flex-col space-y-1">
            {categories.map((cat) => (
                <button
                    key={cat.label}
                    onClick={() => setActiveCategory(cat.label)}
                    className={`
                        w-18 py-2 text-sm font-medium whitespace-nowrap
                        border transition-colors duration-200
                        rounded-xl flex items-center justify-center
                        
                        ${
                        activeCategory === cat.label
                            ? "bg-white text-sky-600 border-gray-300 opacity-100"
                            : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200 opacity-50"
                    }`}
                >
                    <span style={{ fontSize: "19px" }}>{cat.icon}</span>
                </button>
            ))}
        </aside>
    );
}
