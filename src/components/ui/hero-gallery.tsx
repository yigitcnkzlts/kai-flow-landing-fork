"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";

interface HeroGalleryProps {
  className?: string;
}

export const HeroGallery = ({ className }: HeroGalleryProps) => {
  const [images, setImages] = useState<string[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch("/api/demo-images");
        const data = await res.json();
        if (data.images && data.images.length > 0) {
          setImages(data.images);
        }
      } catch (err) {
        console.error("Failed to fetch demo images:", err);
      }
    };

    fetchImages();
  }, []);

  // Pause animation on hover
  const [paused, setPaused] = useState(false);

  if (images.length === 0) {
    return null;
  }

  // Single image - no marquee needed
  if (images.length === 1) {
    return (
      <div className={className}>
        <Image
          src={images[0]}
          alt="KAI Flow demo"
          width={800}
          height={450}
          className="rounded-lg shadow-lg shadow-white/20 max-w-full max-h-[25vh] sm:max-h-[28vh] md:max-h-[33vh] w-auto pointer-events-none border border-white/10 object-contain"
          unoptimized
        />
      </div>
    );
  }

  // Multiple images - marquee effect
  // Duplicate images for seamless looping
  const duplicated = [...images, ...images];

  return (
    <div
      className={className}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <div className="relative overflow-hidden w-full max-w-4xl mx-auto rounded-lg border border-white/10 shadow-lg shadow-white/20">
        {/* Fade edges */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-16 z-10 bg-gradient-to-r from-black/80 to-transparent" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-16 z-10 bg-gradient-to-l from-black/80 to-transparent" />

        <div
          ref={scrollRef}
          className="flex gap-3 sm:gap-6 py-2 sm:py-4 px-2 sm:px-4"
          style={{
            animation: `marquee ${images.length * 5}s linear infinite`,
            animationPlayState: paused ? "paused" : "running",
          }}
        >
          {duplicated.map((src, i) => (
            <div key={`${src}-${i}`} className="flex-shrink-0">
              <Image
                src={src}
                alt={`KAI Flow demo ${(i % images.length) + 1}`}
                width={600}
                height={340}
                className="rounded-md max-h-[20vh] sm:max-h-[24vh] md:max-h-[28vh] w-auto object-contain"
                unoptimized
              />
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
    </div>
  );
};
