'use client';

import { useState } from 'react';
import { FiCamera, FiRotateCw } from 'react-icons/fi';
import FaceLandmarkerComponent from '../FaceLandmarker';

interface ShadeInfo {
  name: string;
  hex: string;
  stock: number;
  image: string;
}

interface LipstickProduct {
  productId: number;
  name: string;
  price: number;
  description: string;
  rating: number;
  reviews: number;
  points: number;
  shades: ShadeInfo[];
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
  shades: [
    { name: 'Fame Flame', hex: '#A41E11', stock: 10, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5irpmQIT7W5e4kb_csa_cMPY35TIS0ROvlyCCAcZDQbFgx4C9h6PROLzkHlIopVZqlA0&usqp=CAU" },
    { name: 'Berry Bliss', hex: '#942B58', stock: 5, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT05BOku03XPJ_uwne5DqBTlDCA51igcVyJqQ&s" },
    { name: 'Pink Petal', hex: '#E35578', stock: 8, image: "https://cdn.tirabeauty.com/v2/billowing-snowflake-434234/tira-p/wrkr/products/pictures/item/free/resize-w:540/1148547/T5fseznUP5-1148547_1.jpg" },
    { name: 'Nude Glow', hex: '#C38771', stock: 12, image: "https://m.media-amazon.com/images/I/61FNrdWeScL._AC_UF894,1000_QL80_.jpg" },
    { name: 'Coral Crush', hex: '#E7625F', stock: 0, image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS8TLqVJMXEQa7OCyjWx0jS-pZ_jHHka5zw2w&s" }
  ]
};

const LipstickProductPage = () => {
  const [selectedShade, setSelectedShade] = useState<ShadeInfo>(lipstickProduct.shades[0]);
  const [quantity, setQuantity] = useState<number>(1);
  const [isWebcamActive, setIsWebcamActive] = useState(false);

  const isInStock = selectedShade.stock > 0;

  const handleShadeChange = (shade: ShadeInfo) => {
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
     <FaceLandmarkerComponent realshade={selectedShade.hex} isWebcamActive={isWebcamActive} />
    <div className="container mx-auto grid md:grid-cols-2 gap-10 p-8">
     
      {/* Left: Product Image & Thumbnails */}
      <div>
        
        <div className="relative">
          <img
            src={selectedShade.image}
            alt={selectedShade.name}
            className="w-[350px] h-[350px] mx-auto rounded-lg object-cover shadow-lg"
          />
          {/* Camera and 360 icons */}
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
          {lipstickProduct.shades.map((shade, index) => (
            <img
              key={index}
              src={shade.image}
              alt={`lipstick-${index}`}
              onClick={() => handleShadeChange(shade)}
              className={`w-20 h-20 rounded-lg cursor-pointer shadow-md ${
                selectedShade.image === shade.image ? 'border-2 border-[#e63946]' : ''
              }`}
            />
          ))}
        </div>
      </div>

      {/* Right: Product Details */}
      <div>
        <h1 className="text-3xl font-bold text-[#e63946]">{lipstickProduct.name}</h1>
        <p className="text-xl mt-2 text-[#333]">৳{lipstickProduct.price.toFixed(2)}</p>
        <p className={isInStock ? 'text-[#2a9d8f] mt-1' : 'text-[#e63946] mt-1'}>
          {isInStock ? 'In Stock' : 'Out of Stock'}
        </p>
        <div className="mt-3 flex items-center space-x-2 text-[#f4a261]">
          <span>
            ⭐{lipstickProduct.rating} ({lipstickProduct.reviews} Reviews)
          </span>
        </div>

        {/* Purchase Points */}
        <div className="mt-4 flex items-center space-x-2">
          <button className="flex items-center bg-[#2a9d8f] text-white px-4 py-2 rounded-lg">
            Purchase this item and get {lipstickProduct.points} Points
          </button>
        </div>

        {/* Shades */}
        <div className="mt-5">
          <p className="text-lg font-semibold">Shades:</p>
          <div className="flex space-x-3 mt-2 ">
            {lipstickProduct.shades.map((shade, index) => (
              <>
                <button
                  key={index}
                  className={`w-8 h-8 relative rounded-full border ${
                    selectedShade.hex === shade.hex ? 'border-[#e63946]' : ''
                  }`}
                  style={{ backgroundColor: shade.hex }}
                  onClick={() => handleShadeChange(shade)}
                >
                  <span className="absolute top-[50px] left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-sm text-gray-700">
                    {selectedShade.name === shade.name && selectedShade.name}
                  </span>
                </button>
              </>
            ))}
          </div>
        </div>

        {/* Quantity and Purchase */}
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