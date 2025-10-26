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
                            category === activeCategory ? "#6CA67C" : "#E1E8E5",
                        color: category === activeCategory ? "#FFFFFF" : "#374151",
                        boxShadow:
                            category === activeCategory
                                ? "0 4px 6px rgba(0, 0, 0, 0.3)"
                                : "0 2px 4px rgba(0, 0, 0, 0.2)",
                        transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.boxShadow =
                            "0 6px 10px rgba(0,0,0,0.35)";
                        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)";
                    }}
                    onMouseLeave={(e) => {
                        (e.currentTarget as HTMLButtonElement).style.boxShadow =
                            category === activeCategory
                                ? "0 4px 6px rgba(0,0,0,0.3)"
                                : "0 2px 4px rgba(0,0,0,0.2)";
                        (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
                    }}
                    className="p-6 rounded-2xl text-left hover:bg-gray-300"
                >
                    {category}
                </button>
            ))}
        </div>
    );
}
