"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { FiCamera, FiRotateCw } from "react-icons/fi";
import { useLipstickContext } from "@/context/ColorContext";
import FaceLandmarkerComponent from "@/components/Lipstick/FaceLandmarker";
import { useCart } from "@/context/CartContext";

const LipstickProductPage = () => {
  const { handleAddToCart } = useCart();
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
  const productId = parseInt(params?.id as string);

  useEffect(() => {
    const foundProduct = products.find((p) => p.productId === productId);
    if (foundProduct) {
      setSelectedProduct(foundProduct);
      setSelectedShade(foundProduct.shades[0]);
    }
  }, [productId, products]);

  if (!selectedProduct)
    return <p className="text-center text-white">Product not found.</p>;

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

  const addToCart = () => {
    const cartItem = {
      id: selectedProduct.productId,
      title: selectedProduct.name,
      quantity,
      image: selectedShade.image,
      price: selectedProduct.price,
      variation: selectedShade?.name || null,
    };
    handleAddToCart(cartItem, quantity);
  };

  return (
    <>
      <FaceLandmarkerComponent />

      <div className="container mx-auto grid md:grid-cols-2 gap-10 p-8 text-white">
        {/* Left */}
        <div>
          <div className="relative">
            <img
              src={selectedShade.image}
              alt={selectedShade.name}
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
            {selectedProduct.shades.map((shade, index) => (
              <img
                key={index}
                src={shade.image}
                alt={`lipstick-${index}`}
                onClick={() => handleShadeChange(shade)}
                className={`w-20 h-20 rounded-lg cursor-pointer shadow-md ${
                  selectedShade.image === shade.image
                    ? "border-2 border-[#e63946]"
                    : "border-2 border-transparent"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Right */}
        <div>
          <h1 className="text-3xl font-bold text-[#e63946]">{selectedProduct.name}</h1>
          <p className="text-xl mt-2 text-gray-300">
            ৳{selectedProduct.price.toFixed(2)}
          </p>
          <p className={`mt-1 ${isInStock ? "text-green-400" : "text-red-500"}`}>
            {isInStock ? "In Stock" : "Out of Stock"}
          </p>

          <div className="mt-3 flex items-center space-x-2 text-yellow-400">
            <span>
              ⭐{selectedProduct.rating} ({selectedProduct.reviews} Reviews)
            </span>
          </div>

          <div className="mt-5">
            <p className="text-lg font-semibold text-white">Shades:</p>
            <div className="flex space-x-3 mt-2">
              {selectedProduct.shades.map((shade, index) => (
                <button
                  key={index}
                  className={`w-8 h-8 relative rounded-full border ${
                    selectedShade.hex === shade.hex
                      ? "border-[#e63946]"
                      : "border-white/20"
                  }`}
                  style={{ backgroundColor: shade.hex }}
                  onClick={() => handleShadeChange(shade)}
                >
                  {selectedShade.name === shade.name && (
                    <span className="absolute top-[50px] left-1/2 transform -translate-x-1/2 text-xs text-gray-300 whitespace-nowrap">
                      {shade.name}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10">
            <p className="text-lg font-semibold text-white">Quantity:</p>
            <div className="flex space-x-3 mt-2">
              <button
                className="px-4 py-2 bg-white/10 rounded-md text-white hover:bg-white/20"
                onClick={() => handleQuantityChange(false)}
                disabled={quantity === 1}
              >
                -
              </button>
              <span className="px-4 py-2">{quantity}</span>
              <button
                className="px-4 py-2 bg-white/10 rounded-md text-white hover:bg-white/20"
                onClick={() => handleQuantityChange(true)}
                disabled={quantity === selectedShade.stock}
              >
                +
              </button>
            </div>

            <button
              onClick={addToCart}
              className="mt-5 px-8 py-3 bg-[#e63946] text-white font-semibold rounded-md w-full hover:bg-[#d62828] transition"
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
