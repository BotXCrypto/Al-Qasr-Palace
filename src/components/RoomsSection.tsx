import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { rooms } from "@/data/rooms";

const RoomsSection = () => {
  return (
    <section id="rooms" className="py-24 md:py-32 bg-cream geometric-pattern">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <p className="font-sans text-primary text-sm tracking-[0.4em] uppercase mb-4">
            Accommodations
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground font-light">
            Exquisite <span className="text-gradient-gold font-medium">Suites</span>
          </h2>
        </div>

        {/* Rooms Grid */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {rooms.map((room, index) => (
            <div
              key={room.title}
              className="group relative bg-card rounded-lg overflow-hidden shadow-card hover:shadow-luxury transition-all duration-500"
            >
              {/* Image */}
              <div className="relative h-80 md:h-96 overflow-hidden">
                <img
                  src={room.image}
                  alt={room.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 to-transparent" />
                
                {/* Price Tag */}
                <div className="absolute top-6 right-6 bg-primary/90 backdrop-blur-sm px-4 py-2 rounded">
                  <span className="font-sans text-primary-foreground text-sm font-semibold tracking-wide">
                    {room.price}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8">
                <p className="font-sans text-primary text-xs tracking-[0.3em] uppercase mb-2">
                  {room.subtitle}
                </p>
                <h3 className="font-serif text-2xl md:text-3xl text-foreground mb-3">
                  {room.title}
                </h3>
                <p className="font-sans text-muted-foreground leading-relaxed mb-6">
                  {room.description}
                </p>

                {/* Features */}
                <div className="flex flex-wrap gap-3 mb-6">
                  {room.features.map((feature) => (
                    <span
                      key={feature}
                      className="font-sans text-xs tracking-wider text-muted-foreground bg-muted px-3 py-1.5 rounded"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                <Link to={`/rooms/${room.id}`}>
                  <Button variant="luxury" className="group/btn">
                    View Details
                    <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover/btn:translate-x-1" />
                  </Button>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* View All Link */}
        <div className="text-center mt-12">
          <Button variant="elegant" size="lg">
            View All Accommodations
          </Button>
        </div>
      </div>
    </section>
  );
};

export default RoomsSection;
