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
                    style={{
                        backgroundColor:
                            category === activeCategory ? "#6CA67C" : "#E5E7EB",
                        color: category === activeCategory ? "#FFFFFF" : "#374151",
                    }}
                    className="p-6 rounded-2xl text-left hover:bg-gray-300"
                >
                    {category}
                </button>
            ))}
        </div>
    );
}
