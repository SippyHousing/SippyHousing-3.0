import { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

interface ImageLightboxProps {
  images: string[];
  /** which image was clicked */
  startIndex?: number;
  onClose: () => void;
  /** Optional: custom renderer, e.g. (url) => <Watermark link={url} /> to keep your watermark. */
  renderImage?: (url: string, index: number) => ReactNode;
}

// Fullscreen slider: arrows, keyboard (← → Esc), swipe on phones, thumbnails, "3 / 12" counter.
export default function ImageLightbox({ images, startIndex = 0, onClose, renderImage }: ImageLightboxProps) {
  const total = images.length;
  const [index, setIndex] = useState(startIndex);
  const touchX = useRef<number | null>(null);
  const activeThumb = useRef<HTMLButtonElement>(null);

  const next = useCallback(() => setIndex((i) => (i + 1) % total), [total]);
  const prev = useCallback(() => setIndex((i) => (i - 1 + total) % total), [total]);

  // keyboard + lock page scroll while open
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") next();
      if (e.key === "ArrowLeft") prev();
    };
    window.addEventListener("keydown", onKey);
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = oldOverflow;
    };
  }, [next, prev, onClose]);

  // preload the neighbours so the next slide shows instantly
  useEffect(() => {
    if (!total) return;
    [index + 1, index - 1].forEach((i) => {
      const img = new Image();
      img.src = images[(i + total) % total];
    });
    activeThumb.current?.scrollIntoView({ inline: "center", block: "nearest", behavior: "smooth" });
  }, [index, images, total]);

  if (!total) return null;

  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > 50) (dx < 0 ? next : prev)(); // swipe left = next, swipe right = previous
  };

  const arrow =
    "absolute top-1/2 -translate-y-1/2 z-10 rounded-full bg-white/10 p-2 sm:p-3 text-white hover:bg-sippy-gold transition-colors";

  return (
    <div
      className="fixed inset-0 z-[100000] flex flex-col bg-black/95"
      role="dialog"
      aria-modal="true"
      aria-label="Property images"
      onClick={onClose} // click on the dark area closes
      onTouchStart={(e) => { touchX.current = e.touches[0].clientX; }}
      onTouchEnd={onTouchEnd}
    >
      {/* top bar */}
      <div className="flex items-center justify-between p-4 text-white/80" onClick={(e) => e.stopPropagation()}>
        <span className="text-sm tracking-wide">{index + 1} / {total}</span>
        <button type="button" onClick={onClose} aria-label="Close" className="p-1 hover:text-sippy-gold transition-colors">
          <X className="h-7 w-7" />
        </button>
      </div>

      {/* current image */}
      <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 sm:px-20">
        {total > 1 && (
          <button type="button" className={`${arrow} left-2 sm:left-5`} aria-label="Previous image"
            onClick={(e) => { e.stopPropagation(); prev(); }}>
            <ChevronLeft className="h-6 w-6" />
          </button>
        )}

        <div className="flex max-h-full max-w-full items-center justify-center" onClick={(e) => e.stopPropagation()}>
          {renderImage ? (
            renderImage(images[index], index)
          ) : (
            <img
              key={index}
              src={images[index]}
              alt={`Property image ${index + 1}`}
              draggable={false}
              className="max-h-[68vh] max-w-full select-none object-contain animate-fade-in sm:max-h-[76vh]"
              
            />
            
          )}
        </div>

        {total > 1 && (
          <button type="button" className={`${arrow} right-2 sm:right-5`} aria-label="Next image"
            onClick={(e) => { e.stopPropagation(); next(); }}>
            <ChevronRight className="h-6 w-6" />
          </button>
        )}
      </div>

      {/* thumbnails */}
      {total > 1 && (
        <div className="overflow-x-auto p-3" onClick={(e) => e.stopPropagation()}>
          <div className="mx-auto flex w-max gap-2">
            {images.map((url, i) => (
              <button
                key={`${url}-${i}`}
                ref={i === index ? activeThumb : undefined}
                type="button"
                onClick={() => setIndex(i)}
                aria-label={`Show image ${i + 1}`}
                className={`h-14 w-20 flex-shrink-0 overflow-hidden rounded border-2 transition ${
                  i === index ? "border-sippy-gold" : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <img src={url} alt="" loading="lazy" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
