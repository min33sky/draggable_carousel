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
  const [positionDiff, setPositionDiff] = useState(0); //? 마우스 이동 거리

  const carouselRef = React.useRef<HTMLDivElement>(null);

  //? 드래그 시작
  const dragStart = (e: React.MouseEvent<HTMLImageElement>) => {
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
    });

    setPositionDiff(positionDiff);
  };

  //? 드래그 끝
  const dragEnd = (e: React.MouseEvent<HTMLImageElement>) => {
    if (!isDragging) return;
    setIsDragStart(false);
    setIsDragging(false);
    autoSlide();
  };

  const autoSlide = () => {
    if (!carouselRef.current) return;

    //? 스크롤 할 이미지가 없을 경우 (가장 끝 부분)이면 함수 종료
    if (
      carouselRef.current.scrollLeft -
        (carouselRef.current.scrollWidth - carouselRef.current.clientWidth) >
        -1 ||
      carouselRef.current.scrollLeft <= 0
    )
      return;

    const absPositionDiff = Math.abs(positionDiff);
    console.log('절대 이동 거리', absPositionDiff);

    const firstImageWidth =
      carouselRef.current.firstElementChild?.clientWidth! + 14;

    let skip = 0; //? 스크롤 할 이미지 수

    let valDifference = firstImageWidth - absPositionDiff; //? 스크롤 할 이미지 너비

    // console.log('valDifference', valDifference);

    if (valDifference < 0) {
      let absVal = Math.abs(valDifference);
      let quotient = Math.floor(absVal / firstImageWidth) + 1;
      skip = firstImageWidth * quotient;
    }

    console.log('skip: ', skip, firstImageWidth);
    console.log('이동: ', prevScrollLeft, valDifference);

    if (carouselRef.current.scrollLeft > prevScrollLeft) {
      carouselRef.current.scrollTo({
        left:
          absPositionDiff > firstImageWidth / 3
            ? carouselRef.current.scrollLeft + skip + valDifference
            : carouselRef.current.scrollLeft - absPositionDiff,
        behavior: 'smooth',
      });
    } else {
      carouselRef.current.scrollTo({
        left:
          absPositionDiff > firstImageWidth / 3
            ? carouselRef.current.scrollLeft - skip - valDifference
            : carouselRef.current.scrollLeft + absPositionDiff,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div aria-label="wrapper" className="relative flex max-w-[1200px]">
      {/* 왼쪽 버튼 */}
      <div
        aria-label="carousel"
        ref={carouselRef}
        className={`flex  cursor-pointer overflow-hidden  ${
          isDragging ? 'cursor-grab scroll-auto' : 'scroll-smooth'
        }`}
        onMouseDown={dragStart}
        onMouseMove={dragging}
        onMouseLeave={dragEnd}
        onMouseUp={dragEnd}
      >
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt="carousel_image"
            className={`pointer-events-none ml-[14px] w-[400px] select-none object-cover first:ml-0`}
            draggable={false}
          />
        ))}
      </div>
      {/* 오른쪽 버튼 */}
    </div>
  );
}
