import React, { useState } from 'react';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/24/outline';

interface Props {
  images: string[];
}

export default function Carousel({ images }: Props) {
  const [isDragStart, setIsDragStart] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [prevPageX, setPrevPageX] = useState(0); //? 이전 마우스 X 좌표
  const [prevScrollLeft, setPrevScrollLeft] = useState(0); //? 이전 캐러셀 스크롤 X 좌표
  const [positionDiff, setPositionDiff] = useState(0); //? 마우스 이동 거리

  const carouselRef = React.useRef<HTMLDivElement>(null);

  //? 드래그 시작
  const dragStart = (
    e: React.MouseEvent<HTMLImageElement> & React.TouchEvent<HTMLImageElement>,
  ) => {
    setIsDragStart(true);
    setPrevPageX(e.pageX || e.touches[0].pageX);
    setPrevScrollLeft(carouselRef.current?.scrollLeft || 0);
  };

  //? 드래그 중
  const dragging = (
    e: React.MouseEvent<HTMLImageElement> & React.TouchEvent<HTMLImageElement>,
  ) => {
    if (!isDragStart) return;

    /**
     *? 마우스 이벤트일 때만 적용한다.
     *? 터치 이벤트때 Unable to preventDefault inside passive event listener 경고가 발생해서
     */
    if (e.type === 'mousemove') {
      e.preventDefault();
    }

    setIsDragging(true);

    const positionDiff = (e.pageX || e.touches[0].pageX) - prevPageX;

    carouselRef.current?.scrollTo({
      left: prevScrollLeft - positionDiff,
    });

    setPositionDiff(positionDiff);
  };

  //? 드래그 끝
  const dragEnd = (
    e: React.MouseEvent<HTMLImageElement> & React.TouchEvent<HTMLImageElement>,
  ) => {
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

    const firstImageWidth =
      carouselRef.current.firstElementChild?.clientWidth! + 14; //? 14 = margin-right

    let skip = 0; //? 스크롤 할 이미지 수

    let valDifference = firstImageWidth - absPositionDiff; //? 스크롤 할 이미지 너비

    if (valDifference < 0) {
      let absVal = Math.abs(valDifference);
      let quotient = Math.floor(absVal / firstImageWidth) + 1;
      skip = firstImageWidth * quotient;
    }

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

  //? 버튼 클릭 시 스크롤
  const handleButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!carouselRef.current) return;

    const firstImageWidth =
      carouselRef.current.firstElementChild?.clientWidth! + 14;

    if (e.currentTarget.id === 'btn-left') {
      carouselRef.current.scrollTo({
        left: carouselRef.current.scrollLeft - firstImageWidth,
        behavior: 'smooth',
      });
    } else if (e.currentTarget.id === 'btn-right') {
      carouselRef.current.scrollTo({
        left: carouselRef.current.scrollLeft + firstImageWidth,
        behavior: 'smooth',
      });
    }
  };

  return (
    <div aria-label="wrapper" className="relative flex w-10/12 max-w-7xl">
      <button aria-label="왼쪽 버튼" id="btn-left" onClick={handleButtonClick}>
        <ArrowLeftIcon className="absolute top-1/2 -left-4 h-8 w-8 -translate-y-1/2 rounded-full bg-slate-500 p-1 text-white opacity-50 transition hover:bg-slate-700 hover:opacity-100" />
      </button>

      <div
        aria-label="carousel"
        ref={carouselRef}
        className={`flex h-72 cursor-pointer items-center overflow-hidden object-contain   ${
          isDragging ? 'cursor-grab scroll-auto' : 'scroll-smooth'
        }`}
        onMouseDown={dragStart}
        onMouseMove={dragging}
        onMouseLeave={dragEnd}
        onMouseUp={dragEnd}
        onTouchStart={dragStart}
        onTouchMove={dragging}
        onTouchEnd={dragEnd}
      >
        {images.map((image, index) => (
          <img
            key={index}
            src={image}
            alt="carousel_image"
            className={`pointer-events-none ml-[14px] w-full select-none object-cover first:ml-0  md:w-[calc(1280px/3)]`}
            draggable={false}
          />
        ))}
      </div>

      <button
        aria-label="오른쪽 버튼"
        id="btn-right"
        onClick={handleButtonClick}
      >
        <ArrowRightIcon className="absolute top-1/2 -right-4 h-8 w-8 -translate-y-1/2 rounded-full bg-slate-500 p-1 text-white opacity-50 transition hover:bg-slate-700 hover:opacity-100" />
      </button>
    </div>
  );
}
