"use client";

import { useState } from "react";
import { FiCamera, FiRotateCw } from "react-icons/fi";
import { useSunglassContext } from "@/context/SunglassContext";
import FaceLandmarkerSunglassComponent from "./FaceLandmarkerSunglassComponent";
import { useCart } from "@/context/CartContext";

  const { handleAddToCart } = useCart();

const SingleSunglass = () => {
  const {
    sunglasses,
    selectedGlass,
    setSelectedGlass,
    isWebcamActive,
    setIsWebcamActive,
  } = useSunglassContext();

  const [quantity, setQuantity] = useState(1);

  const isInStock = selectedGlass?.stock > 0;

  const handleGlassChange = (glass: typeof selectedGlass) => {
    setSelectedGlass(glass);
  };

  const handleQuantityChange = (increment: boolean) => {
    if (increment && quantity < selectedGlass.stock) {
      setQuantity((prev) => prev + 1);
    } else if (!increment && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const toggleWebcam = () => {
    setIsWebcamActive((prev) => !prev);
  };



    const addToCart = () => {
    const cartItem = {
      id: selectedGlass.id,
      title: product.name,
      image: currentImage,
      price: selectedVariation ? selectedVariation.price : product.price,
      variation: selectedVariation ? selectedVariation.name : null,
    };
    handleAddToCart(cartItem, 1); 
    alert(`${product.name} has been added to your cart!`);
  };

  return (
    <>
    <FaceLandmarkerSunglassComponent />
      <div className="container mx-auto grid md:grid-cols-2 gap-10 p-8">
        {/* Left: Sunglass Image & Thumbnails */}
        <div>
          <div className="relative">
            <img
              src={selectedGlass.image}
              alt={selectedGlass.name}
              className="w-[350px] h-[350px] mx-auto rounded-lg object-cover shadow-lg"
            />
            <div className="absolute top-4 right-4 space-x-2">
              <button
                className="bg-[#f8e6e9] p-2 rounded-full shadow-lg"
                onClick={toggleWebcam}
              >
                <FiCamera size={24} className="text-[#e63946]" />
              </button>
              <button className="bg-[#f8e6e9] p-2 rounded-full shadow-lg">
                <FiRotateCw size={24} className="text-[#e63946]" />
              </button>
            </div>
          </div>
          <div className="flex mx-auto justify-center mt-4 space-x-4">
            {sunglasses.map((glass, index) => (
              <img
                key={index}
                src={glass.image}
                alt={`glass-${index}`}
                onClick={() => handleGlassChange(glass)}
                className={`w-20 h-20 rounded-lg cursor-pointer shadow-md ${
                  selectedGlass.image === glass.image
                    ? "border-2 border-[#e63946]"
                    : ""
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right: Sunglass Details */}
        <div>
          <h1 className="text-3xl font-bold text-[#e63946]">{selectedGlass.name}</h1>
          <p className="text-xl mt-2 text-[#333]">৳{selectedGlass.price}</p>
          <p className={isInStock ? "text-[#2a9d8f] mt-1" : "text-[#e63946] mt-1"}>
            {isInStock ? "In Stock" : "Out of Stock"}
          </p>

          <div className="mt-3 flex items-center space-x-2 text-[#f4a261]">
            <span>🕶️ Stylish • UV Protected • Comfortable</span>
          </div>

          <div className="mt-4 flex items-center space-x-2">
            <button className="flex items-center bg-[#2a9d8f] text-white px-4 py-2 rounded-lg">
              Try this glass in AR & earn 100 Points
            </button>
          </div>

          <div className="mt-5">
            <p className="text-lg font-semibold">Models:</p>
            <div className="flex space-x-3 mt-2">
              {sunglasses.map((glass, index) => (
                <button
                style={{ backgroundColor: glass.color }}
                  key={index}
                  className={`w-8 h-8 rounded-full border ${

                    selectedGlass.name === glass.name ? "border-[#e63946]" : ""
                  }`}
                  onClick={() => handleGlassChange(glass)}
                  title={glass.name}
                ></button>
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
                disabled={quantity === selectedGlass.stock}
              >
                +
              </button>
            </div>
            <button
              onClick={addToCart}
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

export default SingleSunglass;
