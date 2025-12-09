import roomLuxury from "@/assets/room-luxury.jpg";
import poolView from "@/assets/pool-view.jpg";

export interface Room {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  longDescription: string;
  image: string;
  gallery: string[];
  price: string;
  pricePerNight: number;
  features: string[];
  amenities: {
    category: string;
    items: string[];
  }[];
  size: string;
  maxGuests: number;
  bedType: string;
}

export const rooms: Room[] = [
  {
    id: "royal-suite",
    title: "Royal Suite",
    subtitle: "Ocean View",
    description: "Immerse yourself in Arabian grandeur with floor-to-ceiling views of the azure sea",
    longDescription: "Experience the pinnacle of Arabian luxury in our Royal Suite, where traditional craftsmanship meets contemporary elegance. Wake up to panoramic ocean views through floor-to-ceiling windows, and indulge in the finest amenities curated for the most discerning travelers. Every detail has been thoughtfully designed to create an unforgettable sanctuary of peace and opulence.",
    image: roomLuxury,
    gallery: [roomLuxury, poolView],
    price: "From $1,200",
    pricePerNight: 1200,
    features: ["180 sqm", "Private Terrace", "Butler Service"],
    amenities: [
      {
        category: "Bedroom",
        items: ["King-size bed with Egyptian cotton linens", "Walk-in wardrobe", "Pillow menu", "Blackout curtains", "In-room safe"],
      },
      {
        category: "Bathroom",
        items: ["Marble bathroom", "Rain shower", "Soaking tub", "Heated floors", "Luxury toiletries"],
      },
      {
        category: "Living Area",
        items: ["Separate living room", "Dining area for 4", "65\" Smart TV", "Bose sound system", "Curated art collection"],
      },
      {
        category: "Technology",
        items: ["High-speed WiFi", "iPad room controls", "USB charging ports", "Smart home automation"],
      },
      {
        category: "Services",
        items: ["24/7 Butler service", "Twice daily housekeeping", "Turndown service", "Private check-in"],
      },
    ],
    size: "180 sqm",
    maxGuests: 3,
    bedType: "King",
  },
  {
    id: "imperial-villa",
    title: "Imperial Villa",
    subtitle: "Beachfront",
    description: "Your private sanctuary with direct beach access and infinity pool",
    longDescription: "The Imperial Villa represents the ultimate expression of Arabian hospitality. This secluded beachfront retreat offers complete privacy with direct access to pristine white sands. Your personal infinity pool overlooks the endless horizon, while the dedicated team of butlers ensures every moment exceeds expectations. The villa features an expansive outdoor terrace, private dining pavilion, and a fully equipped chef's kitchen for bespoke culinary experiences.",
    image: poolView,
    gallery: [poolView, roomLuxury],
    price: "From $3,500",
    pricePerNight: 3500,
    features: ["320 sqm", "Private Pool", "Chef's Kitchen"],
    amenities: [
      {
        category: "Bedroom",
        items: ["Master suite with ocean view", "Second bedroom", "Handcrafted furniture", "Premium bedding", "Dressing room"],
      },
      {
        category: "Bathroom",
        items: ["Dual vanities", "Outdoor shower", "Hammam", "Jacuzzi tub", "Dyson haircare"],
      },
      {
        category: "Outdoor",
        items: ["Private infinity pool", "Sun deck", "Outdoor dining", "Beach cabana", "Private garden"],
      },
      {
        category: "Kitchen",
        items: ["Full chef's kitchen", "Wine fridge", "Espresso machine", "In-villa dining", "BBQ area"],
      },
      {
        category: "Services",
        items: ["Private chef available", "Dedicated villa host", "Chauffeur service", "Priority spa booking"],
      },
    ],
    size: "320 sqm",
    maxGuests: 6,
    bedType: "Two King Beds",
  },
];

export const getRoomById = (id: string): Room | undefined => {
  return rooms.find((room) => room.id === id);
};
