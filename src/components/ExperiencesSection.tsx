import { Sparkles, Waves, UtensilsCrossed, Gem } from "lucide-react";
import restaurantImage from "@/assets/restaurant.jpg";
import spaImage from "@/assets/spa.jpg";

const experiences = [
  {
    icon: Waves,
    title: "Private Beach",
    description: "Exclusive stretch of pristine white sand with personalized cabana service",
  },
  {
    icon: UtensilsCrossed,
    title: "Fine Dining",
    description: "Seven award-winning restaurants featuring world-renowned culinary masters",
  },
  {
    icon: Sparkles,
    title: "Royal Spa",
    description: "Ancient Arabian wellness rituals in our 3,000 sqm sanctuary of serenity",
  },
  {
    icon: Gem,
    title: "Concierge",
    description: "24-hour dedicated service to craft your bespoke Arabian adventure",
  },
];

const ExperiencesSection = () => {
  return (
    <section id="experiences" className="py-24 md:py-32 bg-background">
      <div className="container mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-16 md:mb-20">
          <p className="font-sans text-primary text-sm tracking-[0.4em] uppercase mb-4">
            Experiences
          </p>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl text-foreground font-light mb-6">
            A World of <span className="text-gradient-gold font-medium">Indulgence</span>
          </h2>
          <p className="font-sans text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
            Every moment at Al Qasr Palace is crafted to exceed expectations
          </p>
        </div>

        {/* Experience Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {experiences.map((exp, index) => (
            <div
              key={exp.title}
              className="group p-8 bg-card rounded-lg border border-border hover:border-primary/30 hover:shadow-luxury transition-all duration-500 text-center"
            >
              <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <exp.icon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="font-serif text-xl text-foreground mb-3">{exp.title}</h3>
              <p className="font-sans text-muted-foreground text-sm leading-relaxed">
                {exp.description}
              </p>
            </div>
          ))}
        </div>

        {/* Featured Images */}
        <div className="grid md:grid-cols-2 gap-6 lg:gap-10">
          <div className="relative group overflow-hidden rounded-lg">
            <img
              src={restaurantImage}
              alt="Fine Dining at Al Qasr"
              className="w-full h-80 md:h-96 object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <p className="font-sans text-gold-light text-xs tracking-[0.3em] uppercase mb-2">
                Culinary Excellence
              </p>
              <h3 className="font-serif text-2xl text-ivory">The Grand Dining Room</h3>
            </div>
          </div>

          <div className="relative group overflow-hidden rounded-lg">
            <img
              src={spaImage}
              alt="Royal Spa Experience"
              className="w-full h-80 md:h-96 object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-charcoal/70 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-8">
              <p className="font-sans text-gold-light text-xs tracking-[0.3em] uppercase mb-2">
                Wellness Sanctuary
              </p>
              <h3 className="font-serif text-2xl text-ivory">The Royal Hammam</h3>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ExperiencesSection;
