"use client";

import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";

interface VideoPlayerProps {
  src: string;
  poster?: string;
  onClose?: () => void;
  className?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  poster,
  onClose,
  className = "",
}) => {
  const videoRef = useRef<HTMLDivElement>(null);
  const playerRef = useRef<ReturnType<typeof videojs> | null>(null);

  useEffect(() => {
    // Make sure Video.js player is only initialized once
    if (!playerRef.current) {
      // The Video.js player needs to be _inside_ the component el for React 18 Strict Mode.
      const videoElement = document.createElement("video-js");

      videoElement.classList.add("vjs-big-play-centered");
      videoRef.current?.appendChild(videoElement);

      const player = (playerRef.current = videojs(
        videoElement,
        {
          autoplay: true,
          controls: true,
          responsive: true,
          fluid: true,
          poster: poster,
          sources: [
            {
              src: src,
              type: "video/mp4",
            },
          ],
        },
        () => {
          videojs.log("player is ready");
        }
      ));

      // Handle player events
      player.on("ended", () => {
        onClose?.();
      });

      player.on("error", () => {
        console.error("Video player error");
      });
    }

    // Dispose the Video.js player when the functional component unmounts
    return () => {
      if (playerRef.current && !playerRef.current.isDisposed()) {
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, [src, poster, onClose]);

  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-90 flex items-center justify-center z-50 ${className}`}
    >
      <div className="relative max-w-4xl max-h-full p-4 w-full">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 z-10 bg-white bg-opacity-20 hover:bg-opacity-30 text-white rounded-full p-2 transition-all"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Video player container */}
        <div data-vjs-player>
          <div ref={videoRef} />
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
