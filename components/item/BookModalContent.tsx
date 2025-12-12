import {ItemWithUser} from "@/lib/types/item/item-with-user";

interface BookModalContentProps {
    item: ItemWithUser;
}

export default function BookModalContent({ item }: BookModalContentProps) {
    return (
        <span
            className="text-base font-semibold"
            style={{ color: "var(--color-text-primary)" }}
        >
            {item.title} - {item.author}
        </span>
    );
}