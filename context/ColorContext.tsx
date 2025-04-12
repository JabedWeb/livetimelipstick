"use client";

import { createContext, useContext, useState, ReactNode } from "react";

// --- Data Types ---
interface ShadeInfo {
  name: string;
  hex: string;
  stock: number;
  image: string;
}

interface LipstickProduct {
  productId: number;
  name: string;
  price: number;
  description: string;
  rating: number;
  reviews: number;
  points: number;
  shades: ShadeInfo[];
}

// --- Context Type ---
interface LipstickContextType {
  products: LipstickProduct[];
  selectedProduct: LipstickProduct;
  setSelectedProduct: (product: LipstickProduct) => void;
  selectedShade: ShadeInfo;
  setSelectedShade: (shade: ShadeInfo) => void;
  isWebcamActive: boolean;
  setIsWebcamActive: (active: boolean) => void;
}

// --- Create Context ---
const LipstickContext = createContext<LipstickContextType | undefined>(undefined);

// --- Sample Products ---
const lipstickProducts: LipstickProduct[] = [
  {
    productId: 205,
    name: "Velvet Matte Liquid Lipstick",
    price: 299.99,
    description:
      "Long-lasting, highly pigmented velvet matte finish. Hydrating and non-drying formula for an all-day comfortable wear.",
    rating: 4.8,
    reviews: 234,
    points: 500,
    shades: [
      {
        name: "Fame Flame",
        hex: "#A41E11",
        stock: 10,
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5irpmQIT7W5e4kb_csa_cMPY35TIS0ROvlyCCAcZDQbFgx4C9h6PROLzkHlIopVZqlA0&usqp=CAU",
      },
      {
        name: "Berry Bliss",
        hex: "#942B58",
        stock: 5,
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT05BOku03XPJ_uwne5DqBTlDCA51igcVyJqQ&s",
      },
      {
        name: "Pink Petal",
        hex: "#E35578",
        stock: 8,
        image:
          "https://cdn.tirabeauty.com/v2/billowing-snowflake-434234/tira-p/wrkr/products/pictures/item/free/resize-w:540/1148547/T5fseznUP5-1148547_1.jpg",
      },
    ],
  },
  {
    productId: 206,
    name: "Glossy Sheer Lip Tint",
    price: 249.99,
    description:
      "Natural tint with a moisturizing gloss. Perfect for everyday wear with a sheer finish.",
    rating: 4.6,
    reviews: 150,
    points: 400,
    shades: [
      {
        name: "Nude Glow",
        hex: "#C38771",
        stock: 12,
        image:
          "https://m.media-amazon.com/images/I/61FNrdWeScL._AC_UF894,1000_QL80_.jpg",
      },
      {
        name: "Coral Crush",
        hex: "#E7625F",
        stock: 0,
        image:
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8TLqVJMXEQa7OCyjWx0jS-pZ_jHHka5zw2w&s",
      },
    ],
  },
];

// --- Provider ---
export const LipstickProvider = ({ children }: { children: ReactNode }) => {
  const [products] = useState<LipstickProduct[]>(lipstickProducts);
  const [selectedProduct, setSelectedProduct] = useState<LipstickProduct>(lipstickProducts[0]);
  const [selectedShade, setSelectedShade] = useState<ShadeInfo>(lipstickProducts[0].shades[0]);
  const [isWebcamActive, setIsWebcamActive] = useState<boolean>(false);

  return (
    <LipstickContext.Provider
      value={{
        products,
        selectedProduct,
        setSelectedProduct,
        selectedShade,
        setSelectedShade,
        isWebcamActive,
        setIsWebcamActive,
      }}
    >
      {children}
    </LipstickContext.Provider>
  );
};

// --- Custom Hook ---
export const useLipstickContext = () => {
  const context = useContext(LipstickContext);
  if (!context) {
    throw new Error("useLipstickContext must be used within a LipstickProvider");
  }
  return context;
};
