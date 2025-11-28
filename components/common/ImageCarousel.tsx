"use client";

import { FC } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

interface ImageCarouselProps {
    images: string[];
    thumbnailIndex?: number;
    maxHeight?: string;
}

const ImageCarousel: FC<ImageCarouselProps> = ({ images, thumbnailIndex = 0, maxHeight = "250px" }) => {
    if (!images || images.length === 0) return null;

    const isFirst = thumbnailIndex === 0;
    const isLast = thumbnailIndex === images.length - 1;

    return (
        <div className="pt-2 px-1.5">
            <Swiper
                initialSlide={thumbnailIndex}
                centeredSlides={!isFirst && !isLast}
                centeredSlidesBounds={true}
                slidesPerView={2.15}
                spaceBetween={0}
            >
                {images.map((src, idx) => (
                    <SwiperSlide key={idx} className="!flex justify-center items-center px-1.5">
                        <img
                            key={idx}
                            src={src}
                            alt={`상품 이미지 ${idx + 1}`}
                            className="rounded-2xl object-contain w-full h-full"
                            style={{ maxHeight: maxHeight, width: 'auto' }}
                        />
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default ImageCarousel;