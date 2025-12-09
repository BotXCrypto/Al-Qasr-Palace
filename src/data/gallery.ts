import heroLobby from "@/assets/hero-lobby.jpg";
import roomLuxury from "@/assets/room-luxury.jpg";
import poolView from "@/assets/pool-view.jpg";
import restaurant from "@/assets/restaurant.jpg";
import spa from "@/assets/spa.jpg";

export interface GalleryImage {
  id: string;
  src: string;
  alt: string;
  category: string;
  title: string;
}

export const galleryImages: GalleryImage[] = [
  {
    id: "1",
    src: heroLobby,
    alt: "Grand palace lobby with Arabian architecture",
    category: "Architecture",
    title: "Grand Lobby",
  },
  {
    id: "2",
    src: roomLuxury,
    alt: "Luxurious Royal Suite bedroom",
    category: "Rooms",
    title: "Royal Suite",
  },
  {
    id: "3",
    src: poolView,
    alt: "Infinity pool with ocean views",
    category: "Amenities",
    title: "Infinity Pool",
  },
  {
    id: "4",
    src: restaurant,
    alt: "Fine dining restaurant interior",
    category: "Dining",
    title: "Al Bahar Restaurant",
  },
  {
    id: "5",
    src: spa,
    alt: "Serene spa treatment room",
    category: "Wellness",
    title: "Royal Spa",
  },
  {
    id: "6",
    src: heroLobby,
    alt: "Evening view of palace courtyard",
    category: "Architecture",
    title: "Palace Courtyard",
  },
  {
    id: "7",
    src: roomLuxury,
    alt: "Imperial Villa master bedroom",
    category: "Rooms",
    title: "Imperial Villa",
  },
  {
    id: "8",
    src: poolView,
    alt: "Private beach cabanas",
    category: "Amenities",
    title: "Beach Cabanas",
  },
];

export const galleryCategories = ["All", "Architecture", "Rooms", "Dining", "Wellness", "Amenities"];
