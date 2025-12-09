import { useState } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import GalleryLightbox from "@/components/GalleryLightbox";
import { galleryImages, galleryCategories } from "@/data/gallery";
import { cn } from "@/lib/utils";

const Gallery = () => {
  const [activeCategory, setActiveCategory] = useState("All");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const filteredImages =
    activeCategory === "All"
      ? galleryImages
      : galleryImages.filter((img) => img.category === activeCategory);

  const handleImageClick = (index: number) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-charcoal">
        <div className="container mx-auto px-6 text-center">
          <p className="font-sans text-primary text-sm tracking-[0.4em] uppercase mb-4">
            Visual Journey
          </p>
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-ivory font-light">
            Photo <span className="text-gradient-gold font-medium">Gallery</span>
          </h1>
          <p className="font-sans text-ivory/70 max-w-2xl mx-auto mt-6">
            Explore the elegance and grandeur of Al Qasr Palace through our curated collection of imagery
          </p>
        </div>
      </section>

      {/* Category Filter */}
      <section className="py-8 bg-background border-b border-border sticky top-20 z-30 backdrop-blur-md bg-background/95">
        <div className="container mx-auto px-6">
          <div className="flex flex-wrap justify-center gap-3">
            {galleryCategories.map((category) => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={cn(
                  "font-sans text-sm tracking-wider uppercase px-5 py-2 rounded-full transition-all duration-300",
                  activeCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted text-muted-foreground hover:bg-primary/10 hover:text-primary"
                )}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery Grid */}
      <section className="py-16 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredImages.map((image, index) => (
              <button
                key={image.id}
                onClick={() => handleImageClick(index)}
                className={cn(
                  "group relative overflow-hidden rounded-lg aspect-[4/3] cursor-pointer",
                  index === 0 && "md:col-span-2 md:row-span-2 md:aspect-square"
                )}
              >
                <img
                  src={image.src}
                  alt={image.alt}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-charcoal/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <p className="font-sans text-primary text-xs tracking-[0.3em] uppercase mb-1">
                    {image.category}
                  </p>
                  <h3 className="font-serif text-xl text-ivory">{image.title}</h3>
                </div>
              </button>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      {/* Lightbox */}
      <GalleryLightbox
        images={filteredImages}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </main>
  );
};

export default Gallery;
