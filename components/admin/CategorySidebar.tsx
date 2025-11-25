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
            {categories.map((category) => {
                const isActive = category === activeCategory;

                return (
                    <button
                        key={category}
                        onClick={() => onSelect(category)}
                        style={{
                            backgroundColor: isActive
                                ? "var(--color-admin-tab-bg-active)"
                                : "var(--color-admin-tab-bg-inactive)",
                            color: isActive
                                ? "var(--color-admin-tab-text-active)"
                                : "var(--color-admin-tab-text-inactive)",
                            boxShadow: isActive
                                ? `0 4px 6px var(--admin-shadow-active)`
                                : `0 2px 4px var(--admin-shadow-inactive)`,
                            transition: "all 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.boxShadow =
                                `0 6px 10px var(--admin-shadow-hover)`;
                            e.currentTarget.style.transform = "translateY(-2px)";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.boxShadow = isActive
                                ? `0 4px 6px var(--admin-shadow-active)`
                                : `0 2px 4px var(--admin-shadow-inactive)`;
                            e.currentTarget.style.transform = "translateY(0)";
                        }}
                        className="p-6 rounded-2xl text-left"
                    >
                        {category}
                    </button>
                );
            })}
        </div>
    );
}
