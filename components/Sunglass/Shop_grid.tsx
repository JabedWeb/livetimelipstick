"use client";

import React, { useState } from "react";
import { FaStar } from "react-icons/fa";
import { GrFavorite } from "react-icons/gr";
import Link from "next/link";
import { useSunglassContext } from "@/context/SunglassContext";

const Shop_grid = () => {
  const { sunglasses, setSelectedGlassProduct, setSelectedVariant } = useSunglassContext();

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <div className="grid md:grid-cols-3 gap-8">
        {sunglasses.map((product) => {
          const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);
          const selectedVariant = product.variations[selectedVariantIndex];

          return (
            <div
              key={product.productId}
              className="relative bg-white rounded-2xl shadow-md hover:shadow-lg transition-all p-4 group"
            >
              {/* Image */}
              <div className="relative">
                <img
                  src={selectedVariant.image}
                  alt={selectedVariant.name}
                  className="w-full h-64 object-cover rounded-xl transition-all duration-300"
                />
                <GrFavorite className="absolute top-4 right-4 text-gray-600" />
              </div>

              {/* Product Title */}
              <h1 className="text-lg font-semibold mt-4">{product.name}</h1>

              {/* Ratings */}
              <div className="flex items-center gap-1 mt-2">
                {Array.from({ length: Math.floor(product.rating) }).map((_, i) => (
                  <FaStar className="text-orange-500" key={`filled-${i}`} />
                ))}
                {product.rating < 5 &&
                  Array.from({ length: 5 - Math.floor(product.rating) }).map((_, i) => (
                    <FaStar className="text-gray-300" key={`empty-${i}`} />
                  ))}
                <span className="text-sm text-gray-500 ml-1">({product.reviews})</span>
              </div>

              {/* Price */}
              <p className="text-lg font-bold mt-2">£{product.price.toFixed(2)}</p>

              {/* Color Swatches */}
              <div className="flex gap-2 mt-4 mb-3">
                {product.variations.map((variant, index) => (
                  <div
                    key={index}
                    className={`w-6 h-6 rounded-full cursor-pointer border-2 ${
                      index === selectedVariantIndex ? "ring-2 ring-black" : "border-white"
                    }`}
                    style={{ backgroundColor: variant.color }}
                    title={variant.name}
                    onClick={() => setSelectedVariantIndex(index)}
                  />
                ))}
              </div>

              {/* Try On Button */}
              <Link href={`sunglass/${product.productId}`} className="block">
                <button
                  onClick={() => {
                    setSelectedGlassProduct(product);
                    setSelectedVariant(selectedVariant);
                  }}
                  className="bg-black hidden absolute left-0 bottom group-hover:block text-white w-full py-2 rounded-b-xl transition-all"
                >
                  Try On
                </button>
              </Link>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Shop_grid;
