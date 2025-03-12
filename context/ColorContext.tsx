"use client";

import { createContext, useContext, useState, ReactNode } from "react";

interface ShadeInfo {
  name: string;
  hex: string;
  stock: number;
  image: string;
}

interface LipstickContextType {
  shades: ShadeInfo[];
  selectedShade: ShadeInfo;
  setSelectedShade: (shade: ShadeInfo) => void;
  isWebcamActive: boolean;
  setIsWebcamActive: (active: boolean) => void;
}

const LipstickContext = createContext<LipstickContextType | undefined>(undefined);

const lipstickShades: ShadeInfo[] = [
  { name: "Fame Flame", hex: "#A41E11", stock: 10, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5irpmQIT7W5e4kb_csa_cMPY35TIS0ROvlyCCAcZDQbFgx4C9h6PROLzkHlIopVZqlA0&usqp=CAU" },
  { name: "Berry Bliss", hex: "#942B58", stock: 5, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT05BOku03XPJ_uwne5DqBTlDCA51igcVyJqQ&s" },
  { name: "Pink Petal", hex: "#E35578", stock: 8, image: "https://cdn.tirabeauty.com/v2/billowing-snowflake-434234/tira-p/wrkr/products/pictures/item/free/resize-w:540/1148547/T5fseznUP5-1148547_1.jpg" },
  { name: "Nude Glow", hex: "#C38771", stock: 12, image: "https://m.media-amazon.com/images/I/61FNrdWeScL._AC_UF894,1000_QL80_.jpg" },
  { name: "Coral Crush", hex: "#E7625F", stock: 0, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8TLqVJMXEQa7OCyjWx0jS-pZ_jHHka5zw2w&s" },
];

export const LipstickProvider = ({ children }: { children: ReactNode }) => {
  const [shades] = useState<ShadeInfo[]>(lipstickShades);
  const [selectedShade, setSelectedShade] = useState<ShadeInfo>(lipstickShades[0]);
  const [isWebcamActive, setIsWebcamActive] = useState<boolean>(false);

  return (
    <LipstickContext.Provider value={{ shades, selectedShade, setSelectedShade, isWebcamActive, setIsWebcamActive }}>
      {children}
    </LipstickContext.Provider>
  );
};

// Hook to use the context
export const useLipstickContext = () => {
  const context = useContext(LipstickContext);
  if (!context) {
    throw new Error("useLipstickContext must be used within a LipstickProvider");
  }
  return context;
};