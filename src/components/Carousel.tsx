import React, { useState } from 'react';

interface Props {
  carouselImages: string[];
}

export default function Carousel({ carouselImages }: Props) {
  const [images, setImages] = useState(carouselImages);
  const [isDragStart, setIsDragStart] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [prevPageX, setPrevPageX] = useState(0); //? 이전 마우스 X 좌표
  const [prevScrollLeft, setPrevScrollLeft] = useState(0); //? 이전 캐러셀 스크롤 X 좌표

  const carouselRef = React.useRef<HTMLDivElement>(null);

  //? 드래그 시작
  const dragStart = (e: React.MouseEvent<HTMLImageElement>) => {
    console.log('prevPageX', e.pageX);
    console.log('scrollLeft', carouselRef.current?.scrollLeft);
    setIsDragStart(true);
    setPrevPageX(e.pageX);
    setPrevScrollLeft(carouselRef.current?.scrollLeft || 0);
  };

  //? 드래그 중
  const dragging = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!isDragStart) return;
    e.preventDefault();
    setIsDragging(true);

    const positionDiff = e.pageX - prevPageX;

    carouselRef.current?.scrollTo({
      left: prevScrollLeft - positionDiff,
      behavior: 'smooth',
    });
  };

  //? 드래그 끝
  const dragEnd = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!isDragging) return;
    setIsDragStart(false);
    setIsDragging(false);
  };

  return (
    <div aria-label="wrapper" className="relative flex max-w-[1200px]">
      {/* 왼쪽 버튼 */}
      <div
        aria-label="carousel"
        ref={carouselRef}
        className="flex cursor-pointer overflow-auto scroll-smooth"
      >
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt="carousel_image"
            className="ml-[14px] h-[340px] w-[calc(100%/3)] select-none object-cover first:ml-0"
            draggable={false}
            onMouseDown={dragStart}
            onMouseMove={dragging}
            onMouseLeave={dragEnd}
            onMouseUp={dragEnd}
          />
        ))}
      </div>
      {/* 오른쪽 버튼 */}
    </div>
  );
}
