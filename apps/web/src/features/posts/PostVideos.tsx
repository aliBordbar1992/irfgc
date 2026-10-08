"use client";

import React, { useEffect, useState, useRef } from "react";
import useEmblaCarousel from "embla-carousel-react";
import type { EmblaOptionsType } from "embla-carousel";
import { VideoPlayer } from "@/components/ui/video-player";
import videojs from "video.js";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PostVideosProps {
  videos: string[];
}

export function PostVideos({ videos }: PostVideosProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const playerRefs = useRef<(ReturnType<typeof videojs> | null)[]>([]);

  // Embla for multi-video carousel
  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: false,
    direction: "rtl",
  } as EmblaOptionsType);

  useEffect(() => {
    if (!emblaApi) return;
    const onSelect = () => {
      const idx = emblaApi.selectedScrollSnap();
      setActiveIndex(idx);
    };
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi]);

  // Control video playback based on active index
  useEffect(() => {
    if (videos.length === 0) return;

    playerRefs.current.forEach((player, idx) => {
      if (!player || player.isDisposed()) return;

      try {
        if (idx === activeIndex) {
          // Play and restart the active video
          if (player.readyState() >= 1) {
            // Only if player has metadata
            player.currentTime(0); // Restart from beginning
            const playPromise = player.play();
            if (playPromise) {
              playPromise.catch(() => {
                // Handle autoplay restrictions
                console.log("Autoplay prevented for video", idx);
              });
            }
          }
        } else {
          // Pause non-active videos
          if (player.readyState() >= 1) {
            // Only if player has metadata
            player.pause();
          }
        }
      } catch (error) {
        console.warn(`Error controlling video ${idx}:`, error);
      }
    });
  }, [activeIndex, videos.length]);

  // Cleanup video players on unmount
  useEffect(() => {
    return () => {
      playerRefs.current.forEach((player) => {
        if (player && !player.isDisposed()) {
          try {
            player.pause();
            player.dispose();
          } catch (error) {
            console.warn("Error disposing video player:", error);
          }
        }
      });
      playerRefs.current = [];
    };
  }, []);

  const scrollToIndex = (idx: number) => {
    emblaApi?.scrollTo(Math.max(0, Math.min(videos.length - 1, idx)));
  };

  const handlePlayerReady = (
    player: ReturnType<typeof videojs>,
    index: number
  ) => {
    if (!player || player.isDisposed()) return;

    playerRefs.current[index] = player;

    // If this is the active video, play it
    if (index === activeIndex) {
      try {
        if (player.readyState() >= 1) {
          // Only if player has metadata
          const playPromise = player.play();
          if (playPromise) {
            playPromise.catch(() => {
              console.log("Autoplay prevented for video", index);
            });
          }
        }
      } catch (error) {
        console.warn(`Error playing video ${index}:`, error);
      }
    }
  };

  if (!videos || videos.length === 0) return null;

  if (videos.length === 1) {
    return (
      <div className="relative w-full overflow-hidden rounded-lg">
        <VideoPlayer
          src={videos[0]}
          inline={true}
          onPlayerReady={(player) => handlePlayerReady(player, 0)}
        />
      </div>
    );
  }

  return (
    <div className="relative">
      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex">
          {videos.map((src, idx) => (
            <div key={idx} className="flex-[0_0_100%] px-0">
              <div className="relative w-full overflow-hidden rounded-lg">
                <VideoPlayer
                  src={src}
                  inline={true}
                  onPlayerReady={(player) => handlePlayerReady(player, idx)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Navigation Arrows */}
      <button
        type="button"
        aria-label="Previous video"
        onClick={() => scrollToIndex(activeIndex - 1)}
        className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors"
      >
        <span className="sr-only">Previous</span>
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        type="button"
        aria-label="Next video"
        onClick={() => scrollToIndex(activeIndex + 1)}
        className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full w-8 h-8 flex items-center justify-center transition-colors"
      >
        <span className="sr-only">Next</span>
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1">
        {videos.map((_, idx) => (
          <button
            key={idx}
            aria-label={`Go to video ${idx + 1}`}
            onClick={() => scrollToIndex(idx)}
            className={`w-2 h-2 rounded-full ${
              idx === activeIndex ? "bg-white" : "bg-white/40"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export default PostVideos;
