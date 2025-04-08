"use client";
import { createContext, useContext, useState, ReactNode } from "react";

interface SunglassInfo {
  name: string;
  image: string;
  color?: string;
  stock: number;
}

interface SunglassContextType {
  sunglasses: SunglassInfo[];
  selectedGlass: SunglassInfo;
  setSelectedGlass: (glass: SunglassInfo) => void;
  isWebcamActive: boolean;
  setIsWebcamActive: (active: boolean) => void;
}

const SunglassContext = createContext<SunglassContextType | undefined>(undefined);

const defaultGlasses: SunglassInfo[] = [
  {
    name: "Black Aviator",
    image: "sunglasses.png",
    color : "#000000",
    stock: 10,
  },
  {
    name: "Green Aviator",
    image: "greensunglass.png",
    color : "#008000",
    stock: 5,
  },
];

export const SunglassProvider = ({ children }: { children: ReactNode }) => {
  const [sunglasses] = useState<SunglassInfo[]>(defaultGlasses);
  const [selectedGlass, setSelectedGlass] = useState<SunglassInfo>(defaultGlasses[0]);
  const [isWebcamActive, setIsWebcamActive] = useState<boolean>(false);

  return (
    <SunglassContext.Provider
      value={{ sunglasses, selectedGlass, setSelectedGlass, isWebcamActive, setIsWebcamActive }}
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
