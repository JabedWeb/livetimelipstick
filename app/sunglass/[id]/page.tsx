"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FiCamera, FiRotateCw } from "react-icons/fi";
import { useSunglassContext } from "@/context/SunglassContext";
import SunglassesLandmarkerComponent from "@/components/Sunglass/FaceLandmarkerSunglassComponent";

const SingleSunglass = () => {
  const {
    sunglasses,
    selectedGlassProduct,
    setSelectedGlassProduct,
    selectedVariant,
    setSelectedVariant,
    isWebcamActive,
    setIsWebcamActive,
  } = useSunglassContext();

  const [quantity, setQuantity] = useState(1);
  const params = useParams();

  // Extract product ID from URL
  const productId = parseInt(params?.id as string);

  // Find and set the selected product based on URL ID
  useEffect(() => {
    const foundProduct = sunglasses.find((product) => product.productId === productId);
    if (foundProduct) {
      setSelectedGlassProduct(foundProduct);
      setSelectedVariant(foundProduct.variations[0]); // Set default variant
    }
  }, [productId, sunglasses, setSelectedGlassProduct, setSelectedVariant]);

  // Guard: if no product is found yet
  if (!selectedGlassProduct) return <p className="text-center py-10">Product not found.</p>;

  const isInStock = selectedVariant?.stock > 0;

  const handleVariantChange = (variant: typeof selectedVariant) => {
    setSelectedVariant(variant);
    setQuantity(1); // Reset quantity on variant switch
  };

  const handleQuantityChange = (increment: boolean) => {
    if (increment && quantity < selectedVariant.stock) {
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
      <SunglassesLandmarkerComponent />

      <div className="container mx-auto grid md:grid-cols-2 gap-10 p-8">
        {/* Left: Main Image and Thumbnails */}
        <div>
          <div className="relative">
            <img
              src={selectedVariant.image}
              alt={selectedVariant.name}
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
            {selectedGlassProduct.variations.map((variant, index) => (
              <img
                key={index}
                src={variant.image}
                alt={`variant-${index}`}
                onClick={() => handleVariantChange(variant)}
                className={`w-20 h-20 rounded-lg cursor-pointer shadow-md ${
                  selectedVariant.image === variant.image ? "border-2 border-[#e63946]" : ""
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right: Product Details */}
        <div>
          <h1 className="text-3xl font-bold text-[#e63946]">{selectedGlassProduct.name}</h1>
          <p className="text-xl mt-2 text-[#333]">৳{selectedGlassProduct.price.toFixed(2)}</p>
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
              {selectedGlassProduct.variations.map((variant, index) => (
                <button
                  key={index}
                  style={{ backgroundColor: variant.color }}
                  className={`w-8 h-8 rounded-full border ${
                    selectedVariant.name === variant.name ? "border-[#e63946]" : ""
                  }`}
                  onClick={() => handleVariantChange(variant)}
                  title={variant.name}
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
                disabled={quantity === selectedVariant.stock}
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

export default SingleSunglass;
