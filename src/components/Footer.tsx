import { MapPin, Phone, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground py-16 md:py-20">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <span className="font-serif text-2xl font-semibold tracking-wide text-gradient-gold">
                AL QASR
              </span>
              <span className="font-serif text-sm tracking-[0.3em] uppercase text-ivory/60">
                Palace
              </span>
            </div>
            <p className="font-sans text-ivory/60 text-sm leading-relaxed max-w-md">
              A sanctuary of Arabian luxury where timeless elegance meets 
              unparalleled hospitality on the shores of the Arabian Gulf.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-ivory text-lg mb-4">Explore</h4>
            <nav className="flex flex-col gap-3">
              {["Rooms & Suites", "Dining", "Wellness", "Events", "Gallery"].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="font-sans text-ivory/60 text-sm hover:text-primary transition-colors"
                >
                  {link}
                </a>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-serif text-ivory text-lg mb-4">Contact</h4>
            <div className="flex flex-col gap-4">
              <div className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-primary mt-1 shrink-0" />
                <span className="font-sans text-ivory/60 text-sm">
                  Palm Jumeirah, Dubai<br />
                  United Arab Emirates
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span className="font-sans text-ivory/60 text-sm">+971 4 999 8888</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <span className="font-sans text-ivory/60 text-sm">reservations@alqasr.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-ivory/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="font-sans text-ivory/40 text-xs tracking-wide">
            © 2024 Al Qasr Palace. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <a href="#" className="font-sans text-ivory/40 text-xs hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="font-sans text-ivory/40 text-xs hover:text-primary transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
