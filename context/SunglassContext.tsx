"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// --- Data Types ---
interface GlassVariant {
  name: string;
  image: string;
  color: string; // hex color
  stock: number;
}

interface SunglassProduct {
  productId: number;
  name: string;
  price: number;
  description: string;
  rating: number;
  reviews: number;
  variations: GlassVariant[];
}

// --- Context Type ---
interface SunglassContextType {
  sunglasses: SunglassProduct[];
  selectedGlassProduct: SunglassProduct;
  setSelectedGlassProduct: (product: SunglassProduct) => void;
  selectedVariant: GlassVariant;
  setSelectedVariant: (variant: GlassVariant) => void;
  isWebcamActive: boolean;
  setIsWebcamActive: (active: boolean) => void;
}

// --- Create Context ---
const SunglassContext = createContext<SunglassContextType | undefined>(undefined);

// --- Sample Products ---
const defaultSunglasses: SunglassProduct[] = [
  {
    productId: 301,
    name: "Classic Aviator Sunglasses",
    price: 149.99,
    description: "Timeless aviator design with UV protection and premium lenses.",
    rating: 4.7,
    reviews: 142,
    variations: [
      {
        name: "Black Frame",
        image: "/blacksunglass.png",
        color: "#000000",
        stock: 10,
      },
      {
        name: "Green Frame",
        image: "/greensunglass.png",
        color: "#008000",
        stock: 5,
      },
    ],
  },
  {
    productId: 302,
    name: "Retro Round Sunglasses",
    price: 129.99,
    description: "Round frame with reflective lenses and vintage vibes.",
    rating: 4.5,
    reviews: 89,
    variations: [
      {
        name: "Gold Frame",
        image: "/graysunglass.png",
        color: "	#808080",
        stock: 6,
      },
      {
        name: "Silver Frame",
        image: "/skysunglass.png",
        color: "##87CEEB",
        stock: 3,
      },
    ],
  },
];

export const SunglassProvider = ({ children }: { children: ReactNode }) => {
  const [sunglasses] = useState<SunglassProduct[]>(defaultSunglasses);
  const [selectedGlassProduct, setSelectedGlassProduct] = useState<SunglassProduct>(defaultSunglasses[0]);
  const [selectedVariant, setSelectedVariant] = useState<GlassVariant>(defaultSunglasses[0].variations[0]);
  const [isWebcamActive, setIsWebcamActive] = useState<boolean>(false);

  return (
    <SunglassContext.Provider
      value={{
        sunglasses,
        selectedGlassProduct,
        setSelectedGlassProduct,
        selectedVariant,
        setSelectedVariant,
        isWebcamActive,
        setIsWebcamActive,
      }}
    >
      {children}
    </SunglassContext.Provider>
  );
};

export const useSunglassContext = () => {
  const context = useContext(SunglassContext);
  if (!context) {
    throw new Error("useSunglassContext must be used within a SunglassProvider");
  }
  return context;
};
