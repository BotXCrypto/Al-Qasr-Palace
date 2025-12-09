import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";
import heroImage from "@/assets/hero-lobby.jpg";

const Hero = () => {
  return (
    <section className="relative h-screen min-h-[700px] flex items-center justify-center overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${heroImage})` }}
      />
      
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-hero" />
      
      {/* Geometric Pattern Overlay */}
      <div className="absolute inset-0 geometric-pattern opacity-30" />

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
        <div className="animate-fade-up">
          <p className="font-sans text-gold-light text-sm md:text-base tracking-[0.4em] uppercase mb-6">
            Welcome to Paradise
          </p>
        </div>
        
        <h1 className="font-serif text-5xl md:text-7xl lg:text-8xl text-ivory font-light leading-tight mb-6 animate-fade-up animation-delay-200">
          Where Arabian
          <span className="block text-gradient-gold font-medium">Elegance</span>
          Meets the Sea
        </h1>
        
        <p className="font-sans text-ivory/80 text-lg md:text-xl font-light max-w-2xl mx-auto mb-10 animate-fade-up animation-delay-400 leading-relaxed">
          Experience unparalleled luxury at Al Qasr Palace, where centuries of Arabian heritage 
          blend seamlessly with contemporary opulence.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center animate-fade-up animation-delay-600">
          <Button variant="hero" size="xl">
            Reserve Your Stay
          </Button>
          <Button 
            variant="luxury" 
            size="xl" 
            className="border-ivory/50 text-ivory hover:bg-ivory hover:text-charcoal"
          >
            Explore Suites
          </Button>
        </div>
      </div>

      {/* Scroll Indicator */}
      <a 
        href="#rooms" 
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-ivory/60 hover:text-gold-light transition-colors animate-float"
      >
        <span className="font-sans text-xs tracking-[0.3em] uppercase">Discover</span>
        <ChevronDown size={24} />
      </a>
    </section>
  );
};

export default Hero;
