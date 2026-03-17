"use client";

import { useEffect, useRef, useState } from "react";
import { useVideoLoading } from "@/components/video-loading-context";

interface HeroVideoProps {
  src: string;
  className?: string;
}

export const HeroVideo = ({ src, className }: HeroVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoSrc, setVideoSrc] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const { setVideoLoaded } = useVideoLoading();

  useEffect(() => {
    let isMounted = true;
    const CHUNK_SIZE = 1024 * 1024; // 1MB chunks (approx 10s of high quality video, or more for compressed)

    const fetchVideoInChunks = async () => {
      try {
        // Initial fetch to get headers (size)
        const response = await fetch(src, { method: "HEAD" });
        const contentLength = response.headers.get("Content-Length");
        const totalSize = contentLength ? parseInt(contentLength, 10) : 0;

        if (!totalSize) {
          // Fallback for servers not sending Content-Length or small files
          setVideoSrc(src);
          setLoading(false);
          setVideoLoaded();
          return;
        }

        const chunks: Blob[] = [];
        let loaded = 0;

        while (loaded < totalSize) {
          if (!isMounted) return;

          const end = Math.min(loaded + CHUNK_SIZE, totalSize);
          const chunkResponse = await fetch(src, {
            headers: {
              Range: `bytes=${loaded}-${end - 1}`,
            },
          });

          if (!chunkResponse.ok && chunkResponse.status !== 206) {
            // If Range requests are not supported, fallback to normal src
            setVideoSrc(src);
            setLoading(false);
            setVideoLoaded();
            return;
          }

          const blob = await chunkResponse.blob();
          chunks.push(blob);
          loaded = end;
        }

        if (!isMounted) return;

        // Combine chunks into a single Blob
        const fullBlob = new Blob(chunks, { type: "video/mp4" });
        const blobUrl = URL.createObjectURL(fullBlob);
        setVideoSrc(blobUrl);
        setLoading(false);
        setVideoLoaded();

      } catch (error) {
        console.error("Error fetching video chunks:", error);
        // Fallback on error
        setVideoSrc(src);
        setLoading(false);
        setVideoLoaded();
      }
    };

    fetchVideoInChunks();

    return () => {
      isMounted = false;
      if (videoSrc.startsWith("blob:")) {
        URL.revokeObjectURL(videoSrc);
      }
    };
  }, [src]);

  return (
    <video
      ref={videoRef}
      className={className}
      autoPlay
      muted
      loop
      playsInline
      preload="auto"
      // Use the blob URL if fetched, otherwise empty until loaded (or could fallback to src immediately)
      src={videoSrc || undefined}
      aria-label="KAI Flow platform demonstration video"
    >
      Your browser does not support the video tag.
    </video>
  );
};
