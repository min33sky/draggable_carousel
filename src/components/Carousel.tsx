import React, { useState } from 'react';

interface Props {
  carouselImages: string[];
}

export default function Carousel({ carouselImages }: Props) {
  const [images, setImages] = useState(carouselImages);

  return (
    <div aria-label="wrapper" className="relative flex max-w-[1200px]">
      {/* 왼쪽 버튼 */}
      <div
        aria-label="carousel"
        className="flex cursor-pointer overflow-hidden scroll-smooth"
      >
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt="carousel_image"
            className="ml-[14px] h-[340px] w-[calc(100%/3)] select-none object-cover first:ml-0"
            draggable={false}
          />
        ))}
      </div>
      {/* 오른쪽 버튼 */}
    </div>
  );
}
