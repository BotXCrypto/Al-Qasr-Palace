import { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GalleryImage } from "@/data/gallery";

interface GalleryLightboxProps {
  images: GalleryImage[];
  initialIndex: number;
  isOpen: boolean;
  onClose: () => void;
}

const GalleryLightbox = ({ images, initialIndex, isOpen, onClose }: GalleryLightboxProps) => {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);

  useEffect(() => {
    setCurrentIndex(initialIndex);
  }, [initialIndex]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") goToPrevious();
      if (e.key === "ArrowRight") goToNext();
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, currentIndex]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const current = images[currentIndex];

  return (
    <div className="fixed inset-0 z-50 bg-charcoal/95 backdrop-blur-md flex items-center justify-center">
      {/* Close Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={onClose}
        className="absolute top-6 right-6 text-ivory hover:text-primary hover:bg-ivory/10 z-50"
      >
        <X className="w-6 h-6" />
      </Button>

      {/* Previous Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={goToPrevious}
        className="absolute left-6 top-1/2 -translate-y-1/2 text-ivory hover:text-primary hover:bg-ivory/10"
      >
        <ChevronLeft className="w-8 h-8" />
      </Button>

      {/* Image */}
      <div className="max-w-6xl max-h-[80vh] mx-auto px-20">
        <img
          src={current.src}
          alt={current.alt}
          className="max-w-full max-h-[70vh] object-contain rounded-lg shadow-2xl"
        />
        <div className="text-center mt-6">
          <h3 className="font-serif text-2xl text-ivory">{current.title}</h3>
          <p className="font-sans text-ivory/60 text-sm mt-1">
            {current.category} · {currentIndex + 1} of {images.length}
          </p>
        </div>
      </div>

      {/* Next Button */}
      <Button
        variant="ghost"
        size="icon"
        onClick={goToNext}
        className="absolute right-6 top-1/2 -translate-y-1/2 text-ivory hover:text-primary hover:bg-ivory/10"
      >
        <ChevronRight className="w-8 h-8" />
      </Button>

      {/* Thumbnails */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 overflow-x-auto max-w-full px-6">
        {images.map((image, index) => (
          <button
            key={image.id}
            onClick={() => setCurrentIndex(index)}
            className={`flex-shrink-0 w-16 h-12 rounded overflow-hidden transition-all duration-300 ${
              index === currentIndex
                ? "ring-2 ring-primary ring-offset-2 ring-offset-charcoal"
                : "opacity-50 hover:opacity-80"
            }`}
          >
            <img
              src={image.src}
              alt={image.alt}
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>
    </div>
  );
};

export default GalleryLightbox;
