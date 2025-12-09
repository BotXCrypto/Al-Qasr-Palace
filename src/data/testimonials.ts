export interface Testimonial {
  id: string;
  name: string;
  location: string;
  avatar: string;
  rating: number;
  title: string;
  content: string;
  stayDate: string;
  roomType: string;
}

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Alexandra Rothschild",
    location: "London, UK",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    title: "An unforgettable journey into Arabian luxury",
    content: "From the moment we arrived, every detail was impeccable. The Royal Suite exceeded all expectations with its breathtaking ocean views and exquisite décor. The butler service was extraordinary — anticipating our every need before we even knew it ourselves.",
    stayDate: "October 2024",
    roomType: "Royal Suite",
  },
  {
    id: "2",
    name: "James & Victoria Chen",
    location: "Singapore",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    title: "The perfect anniversary celebration",
    content: "We chose the Imperial Villa for our 25th anniversary and it was pure magic. The private beach, infinity pool, and dedicated staff made us feel like royalty. The chef prepared a stunning candlelit dinner on our terrace — a memory we'll treasure forever.",
    stayDate: "September 2024",
    roomType: "Imperial Villa",
  },
  {
    id: "3",
    name: "Sheikh Mohammed Al Rashid",
    location: "Dubai, UAE",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    title: "True Arabian hospitality at its finest",
    content: "Having stayed at countless luxury properties worldwide, Al Qasr Palace stands apart. The attention to authentic Arabian design, combined with world-class service, creates an experience that feels both grand and intimately personal.",
    stayDate: "November 2024",
    roomType: "Royal Suite",
  },
  {
    id: "4",
    name: "Sophia Laurent",
    location: "Paris, France",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    title: "A sanctuary of peace and elegance",
    content: "The spa treatments were transformative, using traditional hammam techniques with the finest products. Combined with the serene atmosphere of the Royal Suite, this was exactly the rejuvenation I needed. Simply perfection.",
    stayDate: "August 2024",
    roomType: "Royal Suite",
  },
  {
    id: "5",
    name: "Robert & Maria Andersson",
    location: "Stockholm, Sweden",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
    rating: 5,
    title: "Beyond our wildest expectations",
    content: "We traveled with our three children and the staff went above and beyond to ensure everyone was happy. The kids' activities were wonderful, and the villa gave us space to relax while they played. A truly family-friendly luxury experience.",
    stayDate: "July 2024",
    roomType: "Imperial Villa",
  },
];
