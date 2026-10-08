"use client";

import Image from "next/image";
import React, { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaOptionsType } from "embla-carousel";
import { ImageLightbox } from "@/components/ImageLightbox";
import { CarouselArrows } from "@/components/CarouselArrows";
import { CarouselDots } from "@/components/CarouselDots";

interface PostImagesProps {
  images: string[];
}

export function PostImages({ images }: PostImagesProps) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
  } as EmblaOptionsType);
  const [selectedIndex, setSelectedIndex] = useState(0);
  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => setSelectedIndex(emblaApi.selectedScrollSnap());
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  if (!images || images.length === 0) return null;

  const renderSingle = () => (
    <button
      type="button"
      onClick={() => openLightbox(0)}
      className="relative w-full overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
    >
      <div className="relative w-full aspect-video">
        <Image src={images[0]} alt="Post image" fill className="object-cover" />
      </div>
    </button>
  );

  const renderTwo = () => (
    <div className="grid grid-cols-2 gap-2">
      {images.slice(0, 2).map((src, idx) => (
        <button
          type="button"
          key={idx}
          onClick={() => openLightbox(idx)}
          className="relative w-full overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
        >
          <div className="relative w-full aspect-[4/3]">
            <Image
              src={src}
              alt={`Post image ${idx + 1}`}
              fill
              className="object-cover"
            />
          </div>
        </button>
      ))}
    </div>
  );

  const renderThree = () => (
    <div className="grid grid-cols-2 gap-2">
      <button
        type="button"
        onClick={() => openLightbox(0)}
        className="relative w-full overflow-hidden rounded-lg col-span-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
      >
        <div className="relative w-full h-full min-h-0 aspect-[4/3] md:aspect-auto md:h-full md:min-h-[100%]">
          <Image
            src={images[0]}
            alt="Post image 1"
            fill
            className="object-cover"
          />
        </div>
      </button>
      <div className="grid grid-rows-2 gap-2">
        {images.slice(1, 3).map((src, idx) => (
          <button
            type="button"
            key={idx}
            onClick={() => openLightbox(idx + 1)}
            className="relative w-full overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
          >
            <div className="relative w-full aspect-[4/3]">
              <Image
                src={src}
                alt={`Post image ${idx + 2}`}
                fill
                className="object-cover"
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderFour = () => (
    <div className="grid grid-cols-2 gap-2">
      {images.slice(0, 4).map((src, idx) => (
        <button
          type="button"
          key={idx}
          onClick={() => openLightbox(idx)}
          className="relative w-full overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
        >
          <div className="relative w-full aspect-[4/3]">
            <Image
              src={src}
              alt={`Post image ${idx + 1}`}
              fill
              className="object-cover"
            />
          </div>
        </button>
      ))}
    </div>
  );

  const renderFive = () => (
    <div className="grid grid-cols-2 gap-2">
      <div className="grid grid-rows-2 gap-2">
        {images.slice(0, 2).map((src, idx) => (
          <button
            type="button"
            key={idx}
            onClick={() => openLightbox(idx)}
            className="relative w-full overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
          >
            <div className="relative w-full aspect-[4/3]">
              <Image
                src={src}
                alt={`Post image ${idx + 1}`}
                fill
                className="object-cover"
              />
            </div>
          </button>
        ))}
      </div>
      <div className="grid grid-rows-3 gap-2">
        {images.slice(2, 5).map((src, idx) => (
          <button
            type="button"
            key={idx}
            onClick={() => openLightbox(idx + 2)}
            className="relative w-full overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
          >
            <div className="relative w-full aspect-[4/3]">
              <Image
                src={src}
                alt={`Post image ${idx + 3}`}
                fill
                className="object-cover"
              />
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderSlider = () => (
    <div className="relative">
      <div className="embla">
        <div className="embla__viewport" ref={emblaRef}>
          <div className="embla__container">
            {images.map((src, idx) => (
              <div key={idx} className="embla__slide">
                <button
                  type="button"
                  onClick={() => openLightbox(idx)}
                  className="relative w-full overflow-hidden rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-400"
                >
                  <div className="relative w-full aspect-video">
                    <Image
                      src={src}
                      alt={`Post image ${idx + 1}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <CarouselArrows
        count={images.length}
        onPrev={() => emblaApi?.scrollPrev()}
        onNext={() => emblaApi?.scrollNext()}
      />
      <CarouselDots
        count={images.length}
        selectedIndex={selectedIndex}
        goTo={(i) => emblaApi?.scrollTo(i)}
      />
    </div>
  );

  return (
    <>
      {images.length === 1 && renderSingle()}
      {images.length === 2 && renderTwo()}
      {images.length === 3 && renderThree()}
      {images.length === 4 && renderFour()}
      {images.length === 5 && renderFive()}
      {images.length > 5 && renderSlider()}

      {lightboxOpen && (
        <ImageLightbox
          images={images}
          startIndex={lightboxIndex}
          onClose={closeLightbox}
        />
      )}
    </>
  );
}

export default PostImages;
