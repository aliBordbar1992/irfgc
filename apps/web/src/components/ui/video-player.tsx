"use client";

import React, { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import { X } from "lucide-react";

interface VideoPlayerProps {
  src: string;
  poster?: string;
  onClose?: () => void;
  className?: string;
  inline?: boolean;
  onPlayerReady?: (player: ReturnType<typeof videojs>) => void;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  poster,
  onClose,
  className = "",
  inline = false,
  onPlayerReady,
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
          autoplay: inline ? false : true,
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
          // Call the onPlayerReady callback when player is ready
          onPlayerReady?.(player);
        }
      ));

      // Handle player events
      if (!inline) {
        player.on("ended", () => {
          onClose?.();
        });
      }

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
  }, [src, poster, onClose, inline, onPlayerReady]);

  if (inline) {
    return (
      <div className={`w-full ${className}`}>
        <style jsx>{`
          .vjs-big-play-button {
            background-color: rgba(255, 255, 255, 0.9) !important;
            border: none !important;
            border-radius: 50% !important;
            width: 80px !important;
            height: 80px !important;
            left: 50% !important;
            top: 50% !important;
            transform: translate(-50%, -50%) !important;
            box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15) !important;
          }
          .vjs-big-play-button:hover {
            background-color: rgba(255, 255, 255, 1) !important;
            transform: translate(-50%, -50%) scale(1.1) !important;
            transition: all 0.2s ease !important;
          }
          .vjs-big-play-button .vjs-icon-placeholder {
            color: #000 !important;
            font-size: 2.5em !important;
            line-height: 80px !important;
          }
          .vjs-control-bar {
            background-color: rgba(0, 0, 0, 0.7) !important;
          }
        `}</style>
        <div data-vjs-player>
          <div ref={videoRef} />
        </div>
      </div>
    );
  }

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
          <X className="w-6 h-6" />
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
