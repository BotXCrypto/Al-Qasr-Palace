import { useState, useEffect } from "react";
import { Star, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Button } from "@/components/ui/button";
import { testimonials } from "@/data/testimonials";

const TestimonialsSection = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [isAutoPlaying]);

  const goToPrevious = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToNext = () => {
    setIsAutoPlaying(false);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const current = testimonials[currentIndex];

  return (
    <section className="py-24 md:py-32 bg-charcoal relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-10 w-64 h-64 bg-primary rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-primary rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-6 relative z-10">
        {/* Section Header */}
        <div className="text-center mb-16">
          <p className="font-sans text-primary text-sm tracking-[0.4em] uppercase mb-4">
            Guest Experiences
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-ivory font-light">
            Words of <span className="text-gradient-gold font-medium">Praise</span>
          </h2>
        </div>

        {/* Testimonial Card */}
        <div className="max-w-4xl mx-auto">
          <div className="bg-background/5 backdrop-blur-sm border border-ivory/10 rounded-2xl p-8 md:p-12 relative">
            <Quote className="absolute top-8 left-8 w-12 h-12 text-primary/30" />
            
            <div className="flex flex-col items-center text-center">
              {/* Avatar */}
              <img
                src={current.avatar}
                alt={current.name}
                className="w-20 h-20 rounded-full object-cover border-2 border-primary mb-6"
              />

              {/* Rating */}
              <div className="flex gap-1 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-5 h-5 ${
                      i < current.rating ? "text-primary fill-primary" : "text-ivory/30"
                    }`}
                  />
                ))}
              </div>

              {/* Title */}
              <h3 className="font-serif text-2xl md:text-3xl text-ivory mb-6">
                "{current.title}"
              </h3>

              {/* Content */}
              <p className="font-sans text-ivory/80 text-lg leading-relaxed mb-8 max-w-2xl">
                {current.content}
              </p>

              {/* Author */}
              <div>
                <p className="font-serif text-xl text-primary">{current.name}</p>
                <p className="font-sans text-ivory/60 text-sm mt-1">
                  {current.location} · {current.roomType} · {current.stayDate}
                </p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-6 mt-8">
            <Button
              variant="ghost"
              size="icon"
              onClick={goToPrevious}
              className="text-ivory/70 hover:text-primary hover:bg-ivory/10 rounded-full"
            >
              <ChevronLeft className="w-6 h-6" />
            </Button>

            {/* Dots */}
            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setIsAutoPlaying(false);
                    setCurrentIndex(index);
                  }}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${
                    index === currentIndex
                      ? "bg-primary w-8"
                      : "bg-ivory/30 hover:bg-ivory/50"
                  }`}
                />
              ))}
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={goToNext}
              className="text-ivory/70 hover:text-primary hover:bg-ivory/10 rounded-full"
            >
              <ChevronRight className="w-6 h-6" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
