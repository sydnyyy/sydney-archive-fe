export interface CategorySidebarProps<T extends string> {
    categories: T[];
    activeCategory: T;
    onSelect: (category: T) => void;
}

export default function CategorySidebar<T extends string>({
                                                              categories,
                                                              activeCategory,
                                                              onSelect,
                                                          }: CategorySidebarProps<T>) {
    return (
        <div className="flex flex-col gap-2">
            {categories.map((category) => (
                <button
                    key={category}
                    onClick={() => onSelect(category)}
                    className={`p-2 rounded text-left ${
                        category === activeCategory
                            ? "bg-blue-400 text-white"
                            : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                    }`}
                >
                    {category}
                </button>
            ))}
        </div>
    );
}
