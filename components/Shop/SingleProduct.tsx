'use client';

import { useState } from 'react';
import { FiCamera, FiRotateCw } from 'react-icons/fi';


interface StockInfo {
  [color : string]: {
    stock: {[size : string]: number},
    image: string,
  }
}


interface Product {
  productId: number,
  name: string,
  price: number,
  description: string,
  rating: number,
  reviews: number,
  points: number,
  stockInfo: StockInfo,
  sizes: string[],
}

const sunglassesProduct : Product = {
  productId: 102,
  name: "Retro Celebrity Square Sunglasses",
  price: 192.00,
  description: "High-quality vinyl with air channel adhesive for easy bubble-free install & mess-free removal. Pressure sensitive.",
  rating: 4.5,
  reviews: 150,
  points: 364,
  stockInfo: {
    '#000000': {
      stock: { XS: 50, S: 0, M: 80, L: 20, XL: 0 },
      image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTf860vdu5axXoBTGTnfjYhBgDMelbPTdE-qQ&s",
    },
    '#007aff': {
      stock: { XS: 40, S: 50, M: 60, L: 0, XL: 30 },
      image: "https://5.imimg.com/data5/OL/NN/NO/SELLER-22912755/wayfarer-sunglass-500x500.jpg",
    },
    '#134712': {
      stock: { XS: 0, S: 20, M: 50, L: 0, XL: 10 },
      image: "https://classymencollection.com/cdn/shop/products/Basic-Standard-Gasoline-Mirror-Lens-Sunglasses-For-Men.jpg?v=1583864874",
    },
  },
  sizes: ["XS", "S", "M", "L", "XL"],
};


const ProductPage = () => {
  const [selectedColor, setSelectedColor] = useState('#000000');
  const [selectedSize, setSelectedSize] = useState('M');
  const [quantity, setQuantity] = useState(1);

  const stock = sunglassesProduct.stockInfo[selectedColor].stock[selectedSize];
  const isInStock = stock > 0;
  const selectedImage = sunglassesProduct.stockInfo[selectedColor].image;

  const handleColorChange = (color : string) => {
    setSelectedColor(color);
    setSelectedSize('XS'); 
  };

  const handleQuantityChange = (increment : boolean) => {
    if (increment && quantity < stock) {
      setQuantity((prev) => prev + 1);
    } else if (!increment && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  return (
    <div className="container mx-auto grid grid-cols-2 gap-10 p-8">
      {/* Left: Product Image & Thumbnails */}
      <div>
        <div className="relative">
          <img
            src={selectedImage}
            alt="Selected Sunglasses"
            className="w-full h-[350px] rounded-lg object-cover"
          />
          {/* Camera and 360 icons */}
          <div className="absolute top-4 right-4 space-x-2">
            <button className="bg-white p-2 rounded-full">
              <FiCamera size={24} />
            </button>
            <button className="bg-white p-2 rounded-full">
              <FiRotateCw size={24} />
            </button>
          </div>
        </div>
        <div className="flex mt-4 space-x-4">
          {Object.keys(sunglassesProduct.stockInfo).map((color, index) => (
            <img
              key={index}
              src={sunglassesProduct.stockInfo[color].image}
              alt={`sunglass-${index}`}
              onClick={() => handleColorChange(color)}
              className={`w-20 h-20 rounded-lg cursor-pointer ${selectedColor === color ? 'border-2 border-blue-500' : ''}`}
            />
          ))}
        </div>
      </div>

      {/* Right: Product Details */}
      <div>
        <h1 className="text-3xl font-bold">{sunglassesProduct.name}</h1>
        <p className="text-xl mt-2">৳{sunglassesProduct.price.toFixed(2)}</p>
        <p className={isInStock ? 'text-green-600 mt-1' : 'text-red-600 mt-1'}>
          {isInStock ? 'In Stock' : 'Out of Stock'}
        </p>
        <div className="mt-3 flex items-center space-x-2">
          <span>⭐{sunglassesProduct.rating} ({sunglassesProduct.reviews} Reviews)</span>
        </div>

        {/* Purchase Points */}
        <div className="mt-4 flex items-center space-x-2">
          <button className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg">
            Purchase this item and get {sunglassesProduct.points} Points
          </button>
        </div>

        {/* Colors */}
        <div className="mt-5">
          <p className="text-lg font-semibold">Colours:</p>
          <div className="flex space-x-3 mt-2">
            {Object.keys(sunglassesProduct.stockInfo).map((color, index) => (
              <button
                key={index}
                className={`w-8 h-8 rounded-full border ${selectedColor === color ? 'border-black' : ''}`}
                style={{ backgroundColor: color }}
                onClick={() => handleColorChange(color)}
              />
            ))}
          </div>
        </div>

        {/* Sizes */}
        <div className="mt-5">
          <p className="text-lg font-semibold">Size:</p>
          <div className="flex space-x-3 mt-2">
            {sunglassesProduct.sizes.map((size) => (
              <button
                key={size}
                className={`px-4 py-2 rounded-md border ${selectedSize === size ? 'border-black' : ''}`}
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Quantity and Buy Now or Out of Stock */}
        <div className="mt-5 flex items-center space-x-4">
          {isInStock ? (
            <>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => handleQuantityChange(false)}
                  className="bg-black text-white px-3 py-2 rounded-lg"
                >
                  -
                </button>
                <span>{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(true)}
                  className="bg-black text-white px-3 py-2 rounded-lg"
                >
                  +
                </button>
              </div>
              <button className="bg-black hover:bg-gray-700 text-white w-full px-6 py-3 rounded-lg">
                Add to Cart
              </button>
            </>
          ) : (
            <button className="text-gray-300 py-2 rounded-md bg-gray-500 w-full cursor-not-allowed text-lg">Out of Stock 🙁</button>
          )}
        </div>

        {/* Augmented Feature */}
        <div className="mt-5 flex items-center space-x-2 border-t pt-4">
          <button className="bg-white text-black px-4 py-2 border rounded-lg">
            Try Augmented Feature
          </button>
          <p className="text-sm text-gray-600">See if this glass fit or not</p>
        </div>

        {/* Customize Feature */}
        <div className="mt-4 flex items-center space-x-2 border-t pt-4">
          <button className="bg-white text-black px-4 py-2 border rounded-lg">
            Customize your Item
          </button>
          <p className="text-sm text-gray-600">Customize frame and other stuff</p>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
