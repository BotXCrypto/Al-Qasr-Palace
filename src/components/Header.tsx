import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Rooms", href: "#rooms" },
    { label: "Experiences", href: "#experiences" },
    { label: "Dining", href: "#dining" },
    { label: "Wellness", href: "#wellness" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-background/95 backdrop-blur-md shadow-card py-4"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <a href="#" className="flex items-center gap-2 group">
          <span className="font-serif text-2xl md:text-3xl font-semibold tracking-wide text-gradient-gold">
            AL QASR
          </span>
          <span
            className={`font-serif text-sm tracking-[0.3em] uppercase transition-colors ${
              isScrolled ? "text-muted-foreground" : "text-ivory/80"
            }`}
          >
            Palace
          </span>
        </a>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className={`font-sans text-sm tracking-widest uppercase transition-all duration-300 hover:text-primary ${
                isScrolled ? "text-foreground" : "text-ivory hover:text-gold-light"
              }`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button variant={isScrolled ? "hero" : "luxury"} size="lg" className={!isScrolled ? "border-ivory/50 text-ivory hover:bg-ivory hover:text-charcoal" : ""}>
            Book Now
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          className={`lg:hidden p-2 transition-colors ${
            isScrolled ? "text-foreground" : "text-ivory"
          }`}
        >
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-background/98 backdrop-blur-lg border-b border-border animate-fade-in">
          <nav className="container mx-auto px-6 py-6 flex flex-col gap-4">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-sans text-base tracking-widest uppercase text-foreground hover:text-primary transition-colors py-2"
              >
                {link.label}
              </a>
            ))}
            <Button variant="hero" size="lg" className="mt-4">
              Book Now
            </Button>
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
