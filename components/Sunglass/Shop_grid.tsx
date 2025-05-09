"use client";

import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import Link from "next/link";
import { useSunglassContext } from "@/context/SunglassContext";

const Shop_grid = () => {
  const { sunglasses, setSelectedGlassProduct, setSelectedVariant } = useSunglassContext();

  return (
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {sunglasses.map((product) => {
          const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
          const selectedVariant = product.variations[selectedVariantIndex];

          return (
            <div
              key={product.productId}
              className="relative bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow duration-300 overflow-hidden group"
            >
              {/* Product Image */}
              <div className="relative overflow-hidden">
                <img
                  src={selectedVariant.image}
                  alt={selectedVariant.name}
                  className="w-full h-72 object-cover rounded-t-xl transition-transform duration-300 group-hover:scale-105"
                />

                {/* Floating Try On Button */}
                <Link href={`/sunglass/${product.productId}`}>
                  <button
                    onClick={() => {
                      setSelectedGlassProduct(product);
                      setSelectedVariant(selectedVariant);
                    }}
                    className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-black text-white px-4 py-2 rounded-full text-sm font-semibold opacity-0 group-hover:opacity-100 transition-all duration-300"
                  >
                     Try On / Add to Cart
                  </button>
                </Link>
              </div>

              {/* Product Info */}
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-900">{product.name}</h2>

                {/* Rating */}
                <div className="flex items-center gap-1 mt-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <FaStar
                      key={i}
                      className={`text-sm ${
                        i < Math.floor(product.rating) ? "text-yellow-500" : "text-gray-300"
                      }`}
                    />
                  ))}
                  <span className="text-sm text-gray-500 ml-1">({product.reviews})</span>
                </div>

                {/* Price */}
                <p className="text-md font-bold text-black mt-1">£{product.price.toFixed(2)}</p>

                {/* Color Swatches */}
                <div className="flex items-center gap-2 mt-3">
                  {product.variations.map((variant, index) => (
                    <div
                      key={index}
                      title={variant.name}
                      className={`w-6 h-6 rounded-full border-2 cursor-pointer transition-all ${
                        index === selectedVariantIndex ? "ring-2 ring-black" : "border-gray-200"
                      }`}
                      style={{ backgroundColor: variant.color }}
                      onClick={() => setSelectedVariantIndex(index)}
                    />
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Shop_grid;
