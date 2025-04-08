"use client";

import { useState } from "react";
import { FiCamera, FiRotateCw } from "react-icons/fi";
import FaceLandmarkerComponent from "./FaceLandmarker";
import { useLipstickContext } from "@/context/ColorContext";

interface LipstickProduct {
  productId: number;
  name: string;
  price: number;
  description: string;
  rating: number;
  reviews: number;
  points: number;
}

const lipstickProduct: LipstickProduct = {
  productId: 205,
  name: "Velvet Matte Liquid Lipstick",
  price: 299.99,
  description:
    "Long-lasting, highly pigmented velvet matte finish. Hydrating and non-drying formula for an all-day comfortable wear.",
  rating: 4.8,
  reviews: 234,
  points: 500,
};

const LipstickProductPage = () => {
  const { selectedShade, setSelectedShade, shades, isWebcamActive, setIsWebcamActive } = useLipstickContext();
  const [quantity, setQuantity] = useState<number>(1);

  const isInStock = selectedShade.stock > 0;

  const handleShadeChange = (shade: typeof selectedShade) => {
    setSelectedShade(shade);
  };

  const handleQuantityChange = (increment: boolean) => {
    if (increment && quantity < selectedShade.stock) {
      setQuantity((prev) => prev + 1);
    } else if (!increment && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const toggleWebcam = () => {
    setIsWebcamActive((prev) => !prev);
  };

  return (
    <>
      <FaceLandmarkerComponent />
      <div className="container mx-auto grid md:grid-cols-2 gap-10 p-8">
        {/* Left: Product Image & Thumbnails */}
        <div>
          <div className="relative">
            <img
              src={selectedShade.image}
              alt={selectedShade.name}
              className="w-[350px] h-[350px] mx-auto rounded-lg object-cover shadow-lg"
            />
            <div className="absolute top-4 right-4 space-x-2">
              <button className="bg-[#f8e6e9] p-2 rounded-full shadow-lg" onClick={toggleWebcam}>
                <FiCamera size={24} className="text-[#e63946]" />
              </button>
              <button className="bg-[#f8e6e9] p-2 rounded-full shadow-lg">
                <FiRotateCw size={24} className="text-[#e63946]" />
              </button>
            </div>
          </div>
          <div className="flex mx-auto justify-center mt-4 space-x-4">
            {shades.map((shade, index) => (
              <img
                key={index}
                src={shade.image}
                alt={`lipstick-${index}`}
                onClick={() => handleShadeChange(shade)}
                className={`w-20 h-20 rounded-lg cursor-pointer shadow-md ${
                  selectedShade.image === shade.image ? "border-2 border-[#e63946]" : ""
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right: Product Details */}
        <div>
          <h1 className="text-3xl font-bold text-[#e63946]">{lipstickProduct.name}</h1>
          <p className="text-xl mt-2 text-[#333]">৳{lipstickProduct.price.toFixed(2)}</p>
          <p className={isInStock ? "text-[#2a9d8f] mt-1" : "text-[#e63946] mt-1"}>
            {isInStock ? "In Stock" : "Out of Stock"}
          </p>
          <div className="mt-3 flex items-center space-x-2 text-[#f4a261]">
            <span>
              ⭐{lipstickProduct.rating} ({lipstickProduct.reviews} Reviews)
            </span>
          </div>

          <div className="mt-4 flex items-center space-x-2">
            <button className="flex items-center bg-[#2a9d8f] text-white px-4 py-2 rounded-lg">
              Purchase this item and get {lipstickProduct.points} Points
            </button>
          </div>

          <div className="mt-5">
            <p className="text-lg font-semibold">Shades:</p>
            <div className="flex space-x-3 mt-2 ">
              {shades.map((shade, index) => (
                <button
                  key={index}
                  className={`w-8 h-8 relative rounded-full border ${
                    selectedShade.hex === shade.hex ? "border-[#e63946]" : ""
                  }`}
                  style={{ backgroundColor: shade.hex }}
                  onClick={() => handleShadeChange(shade)}
                >
                  <span className="absolute top-[50px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm text-gray-700">
                    {selectedShade.name === shade.name && selectedShade.name}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10">
            <p className="text-lg font-semibold">Quantity:</p>
            <div className="flex space-x-3 mt-2">
              <button
                className="px-4 py-2 bg-gray-200 rounded-md"
                onClick={() => handleQuantityChange(false)}
                disabled={quantity === 1}
              >
                -
              </button>
              <span className="px-4 py-2">{quantity}</span>
              <button
                className="px-4 py-2 bg-gray-200 rounded-md"
                onClick={() => handleQuantityChange(true)}
                disabled={quantity === selectedShade.stock}
              >
                +
              </button>
            </div>
            <button
              className="mt-5 px-8 py-2 bg-[#e63946] text-white rounded-md"
              disabled={!isInStock}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default LipstickProductPage;