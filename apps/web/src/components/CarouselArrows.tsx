import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CarouselArrowsProps {
  count: number;
  onPrev: () => void;
  onNext: () => void;
}

export function CarouselArrows({ count, onPrev, onNext }: CarouselArrowsProps) {
  if (count <= 1) return null;

  return (
    <>
      <button
        type="button"
        aria-label="Previous"
        onClick={onPrev}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-8 h-8 flex items-center justify-center"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        type="button"
        aria-label="Next"
        onClick={onNext}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-8 h-8 flex items-center justify-center"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </>
  );
}

export default CarouselArrows;
