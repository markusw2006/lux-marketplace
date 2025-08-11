export type Addon = {
  id: string;
  name_en: string;
  name_es: string;
  description_en?: string;
  description_es?: string;
  price_delta: number; // MXN cents
  duration_delta_minutes: number;
  max_qty?: number;
  is_required?: boolean;
};

export type Service = {
  id: string;
  category_slug: string;
  title_en: string;
  title_es: string;
  description_en?: string;
  description_es?: string;
  photos?: string[]; // URLs or paths to images
  fixed_base_price: number; // MXN cents
  fixed_duration_minutes: number;
  included_scope_en?: string;
  included_scope_es?: string;
  max_area_sq_m?: number;
  instant_book_enabled?: boolean;
  addons: Addon[];
};

export const services: Service[] = [
  {
    id: "basic-cleaning",
    category_slug: "cleaning",
    title_en: "Basic Cleaning",
    title_es: "Limpieza básica",
    fixed_base_price: 50000, // $500 MXN
    fixed_duration_minutes: 120,
    addons: [
      { id: "windows", name_en: "Window cleaning", name_es: "Limpieza de ventanas", price_delta: 15000, duration_delta_minutes: 30 },
      { id: "fridge", name_en: "Fridge cleaning", name_es: "Limpieza de refrigerador", price_delta: 10000, duration_delta_minutes: 20 },
      { id: "oven", name_en: "Oven cleaning", name_es: "Limpieza de horno", price_delta: 12000, duration_delta_minutes: 20 }
    ],
  },
  {
    id: "faucet-replacement",
    category_slug: "plumbing",
    title_en: "Faucet Replacement",
    title_es: "Cambio de grifo",
    fixed_base_price: 80000, // $800 MXN
    fixed_duration_minutes: 60,
    addons: [
      { id: "supply", name_en: "Supply faucet", name_es: "Suministrar grifo", price_delta: 200000, duration_delta_minutes: 0 },
      { id: "old-disposal", name_en: "Dispose old faucet", name_es: "Desechar grifo viejo", price_delta: 10000, duration_delta_minutes: 0 }
    ],
  },
  {
    id: "drain-unclog",
    category_slug: "plumbing",
    title_en: "Simple Drain Unclog",
    title_es: "Destape simple de drenaje",
    fixed_base_price: 60000, // $600 MXN
    fixed_duration_minutes: 60,
    addons: [
      { id: "snake", name_en: "Auger/Snake", name_es: "Cobra", price_delta: 20000, duration_delta_minutes: 15 }
    ],
  },
  {
    id: "light-fixture",
    category_slug: "electrical",
    title_en: "Light Fixture Installation",
    title_es: "Instalación de luminaria",
    fixed_base_price: 75000, // $750 MXN
    fixed_duration_minutes: 60,
    addons: [
      { id: "ladder", name_en: "High ceiling (ladder)", name_es: "Techo alto (escalera)", price_delta: 15000, duration_delta_minutes: 15 }
    ],
  },
  {
    id: "tv-mount",
    category_slug: "handyman",
    title_en: "TV Mounting",
    title_es: "Montaje de TV",
    fixed_base_price: 90000, // $900 MXN
    fixed_duration_minutes: 90,
    addons: [
      { id: "bracket", name_en: "Provide bracket", name_es: "Proveer soporte", price_delta: 25000, duration_delta_minutes: 0 },
      { id: "conceal", name_en: "Conceal cables", name_es: "Ocultar cables", price_delta: 18000, duration_delta_minutes: 20 }
    ],
  },
  {
    id: "furniture-assembly",
    category_slug: "handyman",
    title_en: "Basic Furniture Assembly",
    title_es: "Armado básico de muebles",
    fixed_base_price: 55000, // $550 MXN
    fixed_duration_minutes: 90,
    addons: [
      { id: "item-count", name_en: "Extra item", name_es: "Artículo adicional", price_delta: 20000, duration_delta_minutes: 30, max_qty: 5 }
    ],
  },
  {
    id: "wall-painting-10m2",
    category_slug: "painting",
    title_en: "Wall Painting (10 m²)",
    title_es: "Pintura de pared (10 m²)",
    fixed_base_price: 120000, // $1200 MXN
    fixed_duration_minutes: 180,
    addons: [
      { id: "paint", name_en: "Provide paint", name_es: "Proveer pintura", price_delta: 35000, duration_delta_minutes: 0 }
    ],
  },
  {
    id: "express-courier",
    category_slug: "courier",
    title_en: "Express Courier (5 km)",
    title_es: "Mensajería exprés (5 km)",
    fixed_base_price: 35000, // $350 MXN
    fixed_duration_minutes: 60,
    addons: [
      { id: "extra-km", name_en: "Extra km", name_es: "Km adicional", price_delta: 5000, duration_delta_minutes: 2, max_qty: 20 }
    ],
  },
  {
    id: "pest-control-basic",
    category_slug: "pest-control",
    title_en: "Basic Pest Control",
    title_es: "Control básico de plagas",
    fixed_base_price: 100000, // $1000 MXN
    fixed_duration_minutes: 120,
    addons: [
      { id: "outdoor", name_en: "Include outdoor", name_es: "Incluir exterior", price_delta: 25000, duration_delta_minutes: 30 }
    ],
  },
  {
    id: "fridge-cleaning",
    category_slug: "cleaning",
    title_en: "Refrigerator Cleaning",
    title_es: "Limpieza de refrigerador",
    fixed_base_price: 25000, // $250 MXN
    fixed_duration_minutes: 30,
    addons: [],
  },
];


