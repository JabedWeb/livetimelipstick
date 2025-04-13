"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FiCamera, FiRotateCw } from "react-icons/fi";
import { useLipstickContext } from "@/context/ColorContext";
import FaceLandmarkerComponent from "@/components/Lipstick/FaceLandmarker";

const LipstickProductPage = () => {
  const {
    products,
    selectedShade,
    setSelectedShade,
    setSelectedProduct,
    selectedProduct,
    setIsWebcamActive,
  } = useLipstickContext();

  const [quantity, setQuantity] = useState(1);
  const params = useParams();

  // Get product ID from the URL
  const productId = parseInt(params?.id as string);

  useEffect(() => {
    const foundProduct = products.find((p) => p.productId === productId);
    if (foundProduct) {
      setSelectedProduct(foundProduct);
      setSelectedShade(foundProduct.shades[0]); // Set initial shade
    }
  }, [productId, products, setSelectedProduct, setSelectedShade]);

  if (!selectedProduct) return <p className="text-center">Product not found.</p>;

  const isInStock = selectedShade?.stock > 0;

  const handleShadeChange = (shade: typeof selectedShade) => {
    setSelectedShade(shade);
    setQuantity(1);
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
        {/* Left */}
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
            {selectedProduct.shades.map((shade, index) => (
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

        {/* Right */}
        <div>
          <h1 className="text-3xl font-bold text-[#e63946]">{selectedProduct.name}</h1>
          <p className="text-xl mt-2 text-[#333]">৳{selectedProduct.price.toFixed(2)}</p>
          <p className={isInStock ? "text-[#2a9d8f] mt-1" : "text-[#e63946] mt-1"}>
            {isInStock ? "In Stock" : "Out of Stock"}
          </p>

          <div className="mt-3 flex items-center space-x-2 text-[#f4a261]">
            <span>
              ⭐{selectedProduct.rating} ({selectedProduct.reviews} Reviews)
            </span>
          </div>

          <div className="mt-4 flex items-center space-x-2">
            <button className="flex items-center bg-[#2a9d8f] text-white px-4 py-2 rounded-lg">
              Purchase this item and get {selectedProduct.points} Points
            </button>
          </div>

          <div className="mt-5">
            <p className="text-lg font-semibold">Shades:</p>
            <div className="flex space-x-3 mt-2">
              {selectedProduct.shades.map((shade, index) => (
                <button
                  key={index}
                  className={`w-8 h-8 relative rounded-full border ${
                    selectedShade.hex === shade.hex ? "border-[#e63946]" : ""
                  }`}
                  style={{ backgroundColor: shade.hex }}
                  onClick={() => handleShadeChange(shade)}
                >
                  {selectedShade.name === shade.name && (
                    <span className="absolute top-[50px] left-1/2 transform -translate-x-1/2 text-sm text-gray-700 whitespace-nowrap">
                      {shade.name}
                    </span>
                  )}
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
