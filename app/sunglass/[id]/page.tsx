"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FiCamera, FiRotateCw } from "react-icons/fi";
import { useSunglassContext } from "@/context/SunglassContext";
import SunglassesLandmarkerComponent from "@/components/Sunglass/FaceLandmarkerSunglassComponent";
import { useCart } from "@/context/CartContext";

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
  const { handleAddToCart } = useCart();
  const productId = parseInt(params?.id as string);

  useEffect(() => {
    const foundProduct = sunglasses.find(
      (product) => product.productId === productId
    );
    if (foundProduct) {
      setSelectedGlassProduct(foundProduct);
      setSelectedVariant(foundProduct.variations[0]);
    }
  }, [productId, sunglasses]);

  if (!selectedGlassProduct)
    return <p className="text-center text-white py-10">Product not found.</p>;

  const isInStock = selectedVariant?.stock > 0;

  const handleVariantChange = (variant: typeof selectedVariant) => {
    setSelectedVariant(variant);
    setQuantity(1);
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

  const addToCart = () => {
    const cartItem = {
      id: selectedGlassProduct.productId,
      title: selectedGlassProduct.name,
      image: selectedVariant.image,
      price: selectedGlassProduct.price,
      variation: selectedVariant ? selectedVariant.name : null,
    };
    handleAddToCart(cartItem, quantity);
  };

  return (
    <>
      <SunglassesLandmarkerComponent />

      <div className="container mx-auto grid md:grid-cols-2 gap-10 p-8 text-white">
        {/* Left: Image */}
        <div>
          <div className="relative">
            <img
              src={selectedVariant.image}
              alt={selectedVariant.name}
              className="w-[350px] h-[350px] mx-auto rounded-lg object-cover shadow-lg"
            />
            <div className="absolute top-4 right-4 space-x-2">
              <button
                className="bg-white/10 p-2 rounded-full shadow-lg hover:bg-white/20 transition"
                onClick={toggleWebcam}
              >
                <FiCamera size={24} className="text-[#e63946]" />
              </button>
              <button className="bg-white/10 p-2 rounded-full shadow-lg hover:bg-white/20 transition">
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
                  selectedVariant.image === variant.image
                    ? "border-2 border-[#e63946]"
                    : "border-2 border-white/10"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right: Info */}
        <div>
          <h1 className="text-3xl font-bold text-[#e63946]">{selectedGlassProduct.name}</h1>
          <p className="text-xl mt-2 text-gray-300">
            ৳{selectedGlassProduct.price.toFixed(2)}
          </p>
          <p className={`mt-1 ${isInStock ? "text-green-400" : "text-red-500"}`}>
            {isInStock ? "In Stock" : "Out of Stock"}
          </p>

          <div className="mt-3 flex items-center space-x-2 text-yellow-400">
            <span>🕶️ Stylish • UV Protected • Comfortable</span>
          </div>

          <div className="mt-5">
            <p className="text-lg font-semibold text-white">Models:</p>
            <div className="flex space-x-3 mt-2">
              {selectedGlassProduct.variations.map((variant, index) => (
                <button
                  key={index}
                  style={{ backgroundColor: variant.color }}
                  className={`w-8 h-8 rounded-full border ${
                    selectedVariant.name === variant.name
                      ? "border-[#e63946]"
                      : "border-white/20"
                  }`}
                  onClick={() => handleVariantChange(variant)}
                  title={variant.name}
                />
              ))}
            </div>
          </div>

          <div className="mt-10">
            <p className="text-lg font-semibold text-white">Quantity:</p>
            <div className="flex space-x-3 mt-2">
              <button
                className="px-4 py-2 bg-white/10 text-white rounded-md hover:bg-white/20"
                onClick={() => handleQuantityChange(false)}
                disabled={quantity === 1}
              >
                -
              </button>
              <span className="px-4 py-2">{quantity}</span>
              <button
                className="px-4 py-2 bg-white/10 text-white rounded-md hover:bg-white/20"
                onClick={() => handleQuantityChange(true)}
                disabled={quantity === selectedVariant.stock}
              >
                +
              </button>
            </div>

            <button
              onClick={addToCart}
              className="mt-5 px-8 py-3 bg-[#e63946] text-white rounded-md w-full hover:bg-[#d62828] transition"
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
