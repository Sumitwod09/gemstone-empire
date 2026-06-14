"use client";

import { useState } from "react";
import Image from "next/image";
import type { GemImage } from "@/types";

interface GemImageGalleryProps {
  images: GemImage[];
  productName: string;
}

export function GemImageGallery({ images, productName }: GemImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const sorted = [...images].sort((a, b) => {
    if (a.is_primary) return -1;
    if (b.is_primary) return 1;
    return a.sort_order - b.sort_order;
  });
  const active = sorted[activeIndex];

  if (!sorted.length) {
    return (
      <div className="aspect-square bg-[var(--color-surface)] rounded-[8px] flex items-center justify-center text-[var(--color-text-muted)]">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-16 h-16 opacity-25" viewBox="0 0 24 24" fill="currentColor">
          <path d="M6.5 5h11l3 5-8.5 9.5L3.5 10z" />
        </svg>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Main image */}
      <div className="aspect-square bg-[var(--color-surface)] rounded-[8px] relative overflow-hidden">
        <Image
          src={active.url}
          alt={active.alt_text ?? productName}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
        />
      </div>

      {/* Thumbnails */}
      {sorted.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {sorted.slice(0, 5).map((img, i) => (
            <button
              key={img.id}
              onClick={() => setActiveIndex(i)}
              className={`flex-shrink-0 w-16 h-16 rounded-[6px] overflow-hidden border-2 transition-colors ${
                i === activeIndex
                  ? "border-[var(--color-accent)]"
                  : "border-[var(--color-border)] hover:border-[var(--color-border-strong)]"
              }`}
            >
              <Image
                src={img.url}
                alt={img.alt_text ?? `${productName} ${i + 1}`}
                width={64}
                height={64}
                className="object-cover w-full h-full"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
