import Header from "@/components/Header";
import Hero from "@/components/Hero";
import RoomsSection from "@/components/RoomsSection";
import ExperiencesSection from "@/components/ExperiencesSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import BookingCTA from "@/components/BookingCTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <RoomsSection />
      <ExperiencesSection />
      <TestimonialsSection />
      <BookingCTA />
      <Footer />
    </main>
  );
};

export default Index;
