"use client";

import type { Tag } from "@/app/lib/types";

interface TaggedImageProps {
    image: string;
    tags: Tag[];
}

export default function TaggedImage({ image, tags }: TaggedImageProps) {
    return (
        <div className="relative w-full">
            <img
                src={image} alt="상품 이미지"
                 className="w-full h-auto object-contain"
            />
            {tags.map((tag, idx) => (
                <a
                    key={idx}
                    className="absolute tag flex flex-col items-center"
                    href={tag.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ left: tag.x, top: tag.y }}
                >
                    <img
                        src={tag.icon}
                        alt="태그 아이콘"
                        className="w-17 h-17 object-contain"
                    />
                    <span
                        className="absolute text-xs px-2 py-0.5 rounded whitespace-nowrap"
                        style={{
                            left: tag.labelX || "100%",
                            top: tag.labelY || "0",
                            color: tag.color || "black",
                            backgroundColor: tag.bgColor || "rgba(255,255,255,0.7)",
                        }}
                    >
                        {tag.label}
                    </span>
                </a>
            ))}
        </div>
    );
}