import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, User, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user, isAdmin, signOut } = useAuth();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { label: "Rooms", href: "#rooms" },
    { label: "Gallery", href: "/gallery" },
    { label: "Experiences", href: "#experiences" },
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
        <Link to="/" className="flex items-center gap-2 group">
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
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8">
          {navLinks.map((link) => (
            link.href.startsWith('/') ? (
              <Link
                key={link.label}
                to={link.href}
                className={`font-sans text-sm tracking-widest uppercase transition-all duration-300 hover:text-primary ${
                  isScrolled ? "text-foreground" : "text-ivory hover:text-gold-light"
                }`}
              >
                {link.label}
              </Link>
            ) : (
              <a
                key={link.label}
                href={link.href}
                className={`font-sans text-sm tracking-widest uppercase transition-all duration-300 hover:text-primary ${
                  isScrolled ? "text-foreground" : "text-ivory hover:text-gold-light"
                }`}
              >
                {link.label}
              </a>
            )
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant={isScrolled ? "outline" : "ghost"} 
                  size="sm"
                  className={!isScrolled ? "text-ivory border-ivory/30 hover:bg-ivory/10" : ""}
                >
                  <User size={18} className="mr-2" />
                  Account
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link to="/my-reservations">My Reservations</Link>
                </DropdownMenuItem>
                {isAdmin && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/admin" className="flex items-center">
                        <Shield size={16} className="mr-2" />
                        Admin Dashboard
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={signOut}>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button 
              variant={isScrolled ? "outline" : "ghost"} 
              size="sm"
              className={!isScrolled ? "text-ivory border-ivory/30 hover:bg-ivory/10" : ""}
              asChild
            >
              <Link to="/auth">Sign In</Link>
            </Button>
          )}
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
              link.href.startsWith('/') ? (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-sans text-base tracking-widest uppercase text-foreground hover:text-primary transition-colors py-2"
                >
                  {link.label}
                </Link>
              ) : (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-sans text-base tracking-widest uppercase text-foreground hover:text-primary transition-colors py-2"
                >
                  {link.label}
                </a>
              )
            ))}
            {user ? (
              <>
                <Link
                  to="/my-reservations"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="font-sans text-base tracking-widest uppercase text-foreground hover:text-primary transition-colors py-2"
                >
                  My Reservations
                </Link>
                {isAdmin && (
                  <Link
                    to="/admin"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="font-sans text-base tracking-widest uppercase text-primary transition-colors py-2 flex items-center gap-2"
                  >
                    <Shield size={16} />
                    Admin Dashboard
                  </Link>
                )}
                <button
                  onClick={() => {
                    signOut();
                    setIsMobileMenuOpen(false);
                  }}
                  className="font-sans text-base tracking-widest uppercase text-foreground hover:text-primary transition-colors py-2 text-left"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/auth"
                onClick={() => setIsMobileMenuOpen(false)}
                className="font-sans text-base tracking-widest uppercase text-foreground hover:text-primary transition-colors py-2"
              >
                Sign In
              </Link>
            )}
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
