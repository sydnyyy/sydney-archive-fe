import { Item } from "@/types/domain/item/item";

interface BookModalContentProps {
    item: Item;
}

export default function BookModalContent({ item }: BookModalContentProps) {
    return (
        <span
            className="text-base font-semibold"
            style={{ color: "var(--color-text-primary)" }}
        >
            {item.title}
        </span>
    );
}