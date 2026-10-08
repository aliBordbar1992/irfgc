"use client";

import Image from "next/image";
import React, { useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaOptionsType } from "embla-carousel";
import { X } from "lucide-react";
import { CarouselArrows } from "./CarouselArrows";

interface ImageLightboxProps {
  images: string[];
  startIndex: number;
  onClose: () => void;
}

export function ImageLightbox({
  images,
  startIndex,
  onClose,
}: ImageLightboxProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: true,
    startIndex,
    dragFree: false,
    containScroll: "trimSnaps",
    direction: "rtl",
  } as EmblaOptionsType);

  useEffect(() => {
    if (emblaApi) {
      console.log(
        "Embla API ready, slides count:",
        emblaApi.slideNodes().length
      );
      console.log("Current slide:", emblaApi.selectedScrollSnap());

      // Debug slide dimensions
      const slides = emblaApi.slideNodes();
      slides.forEach((slide, index) => {
        const rect = slide.getBoundingClientRect();
        console.log(`Slide ${index}:`, {
          width: rect.width,
          height: rect.height,
          left: rect.left,
          top: rect.top,
        });
      });

      // Ensure we're at the correct starting position
      emblaApi.scrollTo(startIndex);
    }
  }, [emblaApi, startIndex]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") emblaApi?.scrollNext();
      if (e.key === "ArrowLeft") emblaApi?.scrollPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [emblaApi, onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center">
      <button
        aria-label="Close"
        onClick={onClose}
        className="absolute top-3 right-3 text-white/80 hover:text-white"
      >
        <X className="w-6 h-6" />
      </button>

      <div className="w-full h-full max-w-5xl max-h-[90vh] px-8">
        <div className="embla">
          <div className="embla__viewport" ref={emblaRef}>
            <div className="embla__container">
              {images.map((src, idx) => (
                <div key={idx} className="embla__slide">
                  <div className="relative w-full h-[70vh]">
                    <span>{idx + 1}</span>
                    <Image
                      src={src}
                      alt={`Image ${idx + 1}`}
                      fill
                      className="object-contain"
                    />
                  </div>
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
      </div>
    </div>
  );
}

export default ImageLightbox;
