'use client';

import { useState } from 'react';

const SingleProduct = () => {
  const product = {
    productId: 101,
    name: "Classic T-Shirt",
    thumbnail: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRocVKsmNzdbVQ1HX8l4AzLQS7YriJGMnWFrg&s",
    variants: [
      {
        color: "Black",
        images: [
          "https://www.gymreapers.com/cdn/shop/files/basic-shirt-black-black-back_f6aa691e-9153-4436-8756-2c699d7c9fea.jpg?v=1725491870&width=3547",
          "https://blucheez.fashion/cdn/shop/files/black-formal-shirt-blucheez-1copy.webp?v=1697296290"
        ],
        sizes: [
          {
            size: "S",
            stock: 20,
            price: 19.99,
            sku: "TSHIRT-BLK-S"
          },
          {
            size: "M",
            stock: 10,
            price: 19.99,
            sku: "TSHIRT-BLK-M"
          }
        ]
      },
      {
        color: "White",
        images: [
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRocVKsmNzdbVQ1HX8l4AzLQS7YriJGMnWFrg&s",
          "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTUOY4SRdSvgbWvpBY-xAkYtpSORB7DEwUK2A&s"
        ],
        sizes: [
          {
            size: "L",
            stock: 0,
            price: 19.99,
            sku: "TSHIRT-WHT-L"
          },
          {
            size: "XL",
            stock: 5,
            price: 19.99,
            sku: "TSHIRT-WHT-XL"
          }
        ]
      }
    ]
  };

  const [selectedVariant, setSelectedVariant] = useState(product.variants[0]);
  const [selectedSize, setSelectedSize] = useState(selectedVariant.sizes[0]);
  const [selectedImage, setSelectedImage] = useState(selectedVariant.images[0]); 

  const handleColorChange = (color) => {
    const newVariant = product.variants.find(variant => variant.color === color);
    setSelectedVariant(newVariant);
    setSelectedSize(newVariant.sizes[0]);
    setSelectedImage(newVariant.images[0]);
  };

  const handleSizeChange = (size) => {
    const newSize = selectedVariant.sizes.find(s => s.size === size);
    setSelectedSize(newSize);
  };

  const handleImageChange = (image) => {
    setSelectedImage(image);
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      {/* Left Side: Images */}
      <div className="col-span-1">
        <img src={selectedImage} alt={product.name} className="w-full object-cover rounded-xl" />
        <div className="flex mt-4 space-x-2">
          {selectedVariant.images.map((image, index) => (
            <img
              key={index}
              src={image}
              alt={`variant-${index}`}
              className="w-20 h-20 object-cover rounded-md cursor-pointer"
              onClick={() => handleImageChange(image)} 
            />
          ))}
        </div>
      </div>

      {/* Right Side: Product Details */}
      <div className="col-span-1">
        <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
        <p className="text-xl mb-2">Price: ${selectedSize.price}</p>
        <div className="mb-4">
          <p className="text-lg font-semibold">Color:</p>
          <div className="flex space-x-4 mt-2">
            {product.variants.map((variant, index) => (
              <button
                key={index}
                className={`w-8 h-8 rounded-full border-2 border-['gray'] ${selectedVariant.color === variant.color ? 'border-2 border-black' : ''}`}
                style={{ backgroundColor: variant.color.toLowerCase() }}
                onClick={() => handleColorChange(variant.color)}
              />
            ))}
          </div>
        </div>

        <div className="mb-4">
          <p className="text-lg font-semibold">Size:</p>
          <div className="flex space-x-4 mt-2">
            {selectedVariant.sizes.map((sizeOption, index) => (
              <button
                key={index}
                className={`px-4 py-2 rounded-md border ${selectedSize.size === sizeOption.size ? 'border-black' : ''}`}
                onClick={() => handleSizeChange(sizeOption.size)}
              >
                {sizeOption.size} {sizeOption.stock === 0 && '(Out of Stock)'}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4">
          <p className="text-md text-gray-600">SKU: {selectedSize.sku}</p>
          <p className="text-md text-gray-600">Stock: {selectedSize.stock}</p>
        </div>
        <div>
            {/* <button className={`bg-black text-white px-3 py-2 rounded-md w-full mt-4 ${selectedSize.stock !== 0 ? 'hover:bg-[gray]' : ' '}`} disabled={selectedSize.stock === 0}>
                {selectedSize.stock ===0 ? 'Out of Stock 🙁' : 'Add to Cart 🛒'}
            </button> */}

            <button
            className={`px-3 py-2 rounded-md w-full mt-4 
            ${selectedSize.stock !== 0 
                ? 'bg-black text-white hover:bg-gray-600'
                : 'bg-gray-300 text-gray-600 cursor-not-allowed'}`}
            disabled={selectedSize.stock === 0}
            >
            {selectedSize.stock === 0 ? 'Out of Stock 🙁' : 'Add to Cart 🛒'}
            </button>

        </div>
      </div>
    </div>
  );
};

export default SingleProduct;
