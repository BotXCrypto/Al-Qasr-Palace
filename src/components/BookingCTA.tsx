import { Button } from "@/components/ui/button";
import { CalendarDays, Star } from "lucide-react";

const BookingCTA = () => {
  return (
    <section id="contact" className="py-24 md:py-32 bg-charcoal relative overflow-hidden">
      {/* Decorative Pattern */}
      <div className="absolute inset-0 geometric-pattern opacity-10" />
      
      {/* Gradient Accent */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Rating */}
          <div className="flex items-center justify-center gap-1 mb-6">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-5 h-5 fill-primary text-primary" />
            ))}
            <span className="font-sans text-ivory/60 text-sm ml-2 tracking-wide">
              Forbes Five-Star
            </span>
          </div>

          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-ivory font-light mb-6">
            Begin Your <span className="text-gradient-gold font-medium">Journey</span>
          </h2>
          
          <p className="font-sans text-ivory/70 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
            Let our dedicated team craft an unforgettable experience tailored to your every desire. 
            Your palace awaits.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="hero" size="xl" className="gap-3">
              <CalendarDays className="w-5 h-5" />
              Check Availability
            </Button>
            <Button 
              variant="luxury" 
              size="xl" 
              className="border-ivory/30 text-ivory hover:bg-ivory hover:text-charcoal"
            >
              Contact Concierge
            </Button>
          </div>

          {/* Trust Badges */}
          <div className="mt-16 pt-10 border-t border-ivory/10">
            <p className="font-sans text-ivory/40 text-xs tracking-[0.3em] uppercase mb-6">
              As Featured In
            </p>
            <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12 text-ivory/30">
              <span className="font-serif text-xl tracking-wide">Condé Nast</span>
              <span className="font-serif text-xl tracking-wide">Forbes Travel</span>
              <span className="font-serif text-xl tracking-wide">Robb Report</span>
              <span className="font-serif text-xl tracking-wide">Tatler</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BookingCTA;
