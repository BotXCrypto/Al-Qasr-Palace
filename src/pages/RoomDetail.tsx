import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Bed, Users, Maximize2, Check } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import BookingForm from "@/components/BookingForm";
import RoomFloorPlan from "@/components/RoomFloorPlan";
import AvailabilityCalendar from "@/components/AvailabilityCalendar";
import GalleryLightbox from "@/components/GalleryLightbox";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { getRoomById, rooms } from "@/data/rooms";
import { useState } from "react";

const RoomDetail = () => {
  const { roomId } = useParams();
  const room = getRoomById(roomId || "");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  if (!room) {
    return (
      <main className="min-h-screen">
        <Header />
        <div className="pt-32 pb-20 container mx-auto px-6 text-center">
          <h1 className="font-serif text-4xl mb-4">Room Not Found</h1>
          <p className="text-muted-foreground mb-8">
            The room you're looking for doesn't exist.
          </p>
          <Link to="/#rooms">
            <Button variant="hero">View All Rooms</Button>
          </Link>
        </div>
        <Footer />
      </main>
    );
  }

  const galleryImages = room.gallery.map((src, i) => ({
    id: String(i),
    src,
    alt: `${room.title} - Image ${i + 1}`,
    category: "Rooms",
    title: room.title,
  }));

  return (
    <main className="min-h-screen">
      <Header />

      {/* Hero Image */}
      <section className="relative h-[60vh] md:h-[70vh]">
        <img
          src={room.image}
          alt={room.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-charcoal/30" />
        
        {/* Back Button */}
        <Link
          to="/#rooms"
          className="absolute top-28 left-6 flex items-center gap-2 text-ivory hover:text-primary transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-sans text-sm tracking-wider uppercase">Back to Rooms</span>
        </Link>

        {/* Room Title */}
        <div className="absolute bottom-0 left-0 right-0 p-8 md:p-12">
          <div className="container mx-auto">
            <p className="font-sans text-primary text-sm tracking-[0.4em] uppercase mb-3">
              {room.subtitle}
            </p>
            <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl text-ivory font-light">
              {room.title}
            </h1>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-3 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-12">
              {/* Overview */}
              <div>
                <h2 className="font-serif text-3xl text-foreground mb-6">Overview</h2>
                <p className="font-sans text-muted-foreground leading-relaxed text-lg">
                  {room.longDescription}
                </p>

                {/* Quick Info */}
                <div className="flex flex-wrap gap-6 mt-8">
                  <div className="flex items-center gap-3 bg-muted px-4 py-3 rounded-lg">
                    <Maximize2 className="w-5 h-5 text-primary" />
                    <span className="font-sans">{room.size}</span>
                  </div>
                  <div className="flex items-center gap-3 bg-muted px-4 py-3 rounded-lg">
                    <Users className="w-5 h-5 text-primary" />
                    <span className="font-sans">Up to {room.maxGuests} guests</span>
                  </div>
                  <div className="flex items-center gap-3 bg-muted px-4 py-3 rounded-lg">
                    <Bed className="w-5 h-5 text-primary" />
                    <span className="font-sans">{room.bedType}</span>
                  </div>
                </div>
              </div>

              {/* Gallery Preview */}
              <div>
                <h2 className="font-serif text-3xl text-foreground mb-6">Gallery</h2>
                <div className="grid grid-cols-2 gap-4">
                  {room.gallery.map((img, index) => (
                    <button
                      key={index}
                      onClick={() => {
                        setLightboxIndex(index);
                        setLightboxOpen(true);
                      }}
                      className="relative aspect-[4/3] rounded-lg overflow-hidden group"
                    >
                      <img
                        src={img}
                        alt={`${room.title} gallery ${index + 1}`}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-charcoal/0 group-hover:bg-charcoal/30 transition-colors flex items-center justify-center">
                        <span className="opacity-0 group-hover:opacity-100 text-ivory font-sans text-sm tracking-wider uppercase transition-opacity">
                          View
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Amenities */}
              <div>
                <h2 className="font-serif text-3xl text-foreground mb-6">Amenities</h2>
                <div className="grid md:grid-cols-2 gap-6">
                  {room.amenities.map((category) => (
                    <div key={category.category} className="bg-muted rounded-xl p-6">
                      <h3 className="font-serif text-xl text-foreground mb-4">
                        {category.category}
                      </h3>
                      <ul className="space-y-3">
                        {category.items.map((item) => (
                          <li key={item} className="flex items-start gap-3">
                            <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                            <span className="font-sans text-muted-foreground text-sm">
                              {item}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>

              {/* Floor Plan */}
              <RoomFloorPlan room={room} />

              {/* Availability Calendar */}
              <AvailabilityCalendar pricePerNight={room.pricePerNight} />
            </div>

            {/* Sidebar - Booking */}
            <div className="lg:col-span-1">
              <div className="sticky top-28 bg-card rounded-2xl border border-border p-6 shadow-card">
                <div className="flex items-baseline justify-between mb-6">
                  <span className="font-serif text-3xl text-foreground">
                    ${room.pricePerNight.toLocaleString()}
                  </span>
                  <span className="font-sans text-muted-foreground">/ night</span>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="hero" size="lg" className="w-full mb-4">
                      Reserve Now
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="font-serif text-2xl">
                        Book {room.title}
                      </DialogTitle>
                    </DialogHeader>
                    <BookingForm selectedRoom={room} />
                  </DialogContent>
                </Dialog>

                <p className="text-xs text-muted-foreground text-center">
                  No payment required now. Our team will confirm availability.
                </p>

                <div className="mt-6 pt-6 border-t border-border space-y-3">
                  {room.features.map((feature) => (
                    <div key={feature} className="flex items-center gap-3">
                      <Check className="w-4 h-4 text-primary" />
                      <span className="font-sans text-sm text-muted-foreground">
                        {feature}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other Rooms */}
      <section className="py-16 bg-cream geometric-pattern">
        <div className="container mx-auto px-6">
          <h2 className="font-serif text-3xl text-foreground mb-8 text-center">
            Explore Other Accommodations
          </h2>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {rooms
              .filter((r) => r.id !== room.id)
              .map((otherRoom) => (
                <Link
                  key={otherRoom.id}
                  to={`/rooms/${otherRoom.id}`}
                  className="group bg-card rounded-lg overflow-hidden shadow-card hover:shadow-luxury transition-all"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img
                      src={otherRoom.image}
                      alt={otherRoom.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <p className="font-sans text-primary text-xs tracking-[0.3em] uppercase mb-1">
                      {otherRoom.subtitle}
                    </p>
                    <h3 className="font-serif text-xl text-foreground">
                      {otherRoom.title}
                    </h3>
                    <p className="font-sans text-muted-foreground text-sm mt-2">
                      {otherRoom.price}/night
                    </p>
                  </div>
                </Link>
              ))}
          </div>
        </div>
      </section>

      <Footer />

      {/* Lightbox */}
      <GalleryLightbox
        images={galleryImages}
        initialIndex={lightboxIndex}
        isOpen={lightboxOpen}
        onClose={() => setLightboxOpen(false)}
      />
    </main>
  );
};

export default RoomDetail;
