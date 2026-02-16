import { Product } from "./schemas";

export const dummyProducts: Product[] = [
  {
    id: "1",
    name: {
      en: "Handmade Mug",
      fa: "لیوان دست ساز",
      ps: "د لاس جوړ شوی پیاله",
    },
    description: {
      en: "A beautiful handmade mug.",
      fa: "یک لیوان زیبا و دست ساز.",
      ps: "یو ښکلی د لاس جوړ شوی پیاله.",
    },
    price: 25.0,
    image: "https://placehold.co/400",
    category: "Home",
    status: "active",
    inventory: 10,
  },
  {
    id: "2",
    name: {
      en: "Wool Scarf",
      fa: "شال پشمی",
      ps: "د وړیو شال",
    },
    description: {
      en: "Warm and cozy wool scarf.",
      fa: "شال پشمی گرم و راحت.",
      ps: "ګرم او راحته د وړیو شال.",
    },
    price: 45.0,
    image: "https://placehold.co/400",
    category: "Clothing",
    status: "active",
    inventory: 5,
  },
  {
    id: "3",
    name: {
      en: "Silver Necklace",
      fa: "گردنبند نقره",
      ps: "د سپینو زرو غاړکۍ",
    },
    description: {
      en: "Elegant silver necklace.",
      fa: "گردنبند نقره زیبا.",
      ps: "ښکلی د سپینو زرو غاړکۍ.",
    },
    price: 120.0,
    image: "https://placehold.co/400",
    category: "Jewelry",
    status: "active",
    inventory: 3,
  },
];
