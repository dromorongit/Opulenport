"use client";

import { useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight, ImageOff } from "lucide-react";

type ImageGalleryProps = {
  images?: string[];
};

export default function ImageGallery({ images = [] }: ImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const safeImages = images ?? [];
  const currentImage = safeImages[activeIndex] ?? null;
  const hasImages = safeImages.length > 0;

  const goToPrev = () => {
    if (!hasImages) return;
    setActiveIndex((prev) => (prev - 1 + safeImages.length) % safeImages.length);
  };

  const goToNext = () => {
    if (!hasImages) return;
    setActiveIndex((prev) => (prev + 1) % safeImages.length);
  };

  return (
    <div className="flex flex-col md:flex-row gap-4">
      {/* Main image area with overlay arrows */}
      <div className="relative flex-1">
         <div className="relative aspect-video w-full overflow-hidden rounded-lg bg-navy-light">
          {currentImage ? (
            <Image
              src={currentImage}
              alt={`Product image ${activeIndex + 1}`}
              fill
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <ImageOff className="h-12 w-12 text-cream/30" />
            </div>
          )}
        </div>

        {hasImages && safeImages.length > 1 && (
          <>
            <button
              type="button"
              onClick={goToPrev}
              className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-navy/60 p-2 text-cream hover:bg-navy/80"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={goToNext}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-navy/60 p-2 text-cream hover:bg-navy/80"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnail strip */}
      {hasImages && safeImages.length > 1 && (
        <div className="flex md:flex-col gap-2 overflow-x-auto md:overflow-y-auto md:max-h-[400px] pb-2 md:pb-0 md:pr-1">
          {safeImages.map((src, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => setActiveIndex(idx)}
              className={`relative h-16 w-24 flex-shrink-0 overflow-hidden rounded-md border-2 transition-colors ${
                idx === activeIndex
                  ? "border-gold"
                  : "border-transparent opacity-70 hover:opacity-100"
              }`}
              aria-label={`View image ${idx + 1}`}
            >
              <Image
                src={src}
                alt={`Thumbnail ${idx + 1}`}
                fill
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
