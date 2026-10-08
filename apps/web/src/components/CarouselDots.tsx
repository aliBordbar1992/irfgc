import React from "react";

interface CarouselDotsProps {
  count: number;
  selectedIndex: number;
  goTo: (i: number) => void;
}

export function CarouselDots({
  count,
  selectedIndex,
  goTo,
}: CarouselDotsProps) {
  if (count <= 1) return null;

  return (
    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
      {Array.from({ length: count }).map((_, idx) => (
        <button
          key={idx}
          aria-label={`Go to slide ${idx + 1}`}
          onClick={() => goTo(idx)}
          className={`w-2 h-2 rounded-full ${
            idx === selectedIndex ? "bg-white" : "bg-white/40"
          }`}
        />
      ))}
    </div>
  );
}

export default CarouselDots;
