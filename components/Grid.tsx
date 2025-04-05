import { FaHeart, FaEye, FaStar, FaShoppingCart } from "react-icons/fa";

const products = [
  {
    id: 1,
    name: "Sunglass for man and Woman",
    price: 100,
    rating: 3,
    reviews: 35,
    image: "https://m.media-amazon.com/images/I/61FNrdWeScL._AC_UF894,1000_QL80_.jpg",
    isNew: false,
  },
  {
    id: 2,
    name: "CANON EOS DSLR Camera",
    price: 360,
    rating: 4,
    reviews: 95,
    image: "https://m.media-amazon.com/images/I/61FNrdWeScL._AC_UF894,1000_QL80_.jpg",
    isNew: false,
  },
  {
    id: 3,
    name: "ASUS FHD Gaming Laptop",
    price: 700,
    rating: 5,
    reviews: 325,
    image: "https://m.media-amazon.com/images/I/61FNrdWeScL._AC_UF894,1000_QL80_.jpg",
    isNew: false,
  },
  {
    id: 4,
    name: "Curology Product Set",
    price: 500,
    rating: 4,
    reviews: 145,
    image: "https://m.media-amazon.com/images/I/61FNrdWeScL._AC_UF894,1000_QL80_.jpg",
    isNew: false,
  },
  {
    id: 5,
    name: "Kids Electric Car",
    price: 960,
    rating: 4,
    reviews: 65,
    image: "https://m.media-amazon.com/images/I/61FNrdWeScL._AC_UF894,1000_QL80_.jpg",
    isNew: true,
  },
  {
    id: 6,
    name: "Jr. Zoom Soccer Cleats",
    price: 1160,
    rating: 3,
    reviews: 35,
    image: "https://m.media-amazon.com/images/I/61FNrdWeScL._AC_UF894,1000_QL80_.jpg",
    isNew: false,
  },
  {
    id: 7,
    name: "GP11 Shooter USB Gamepad",
    price: 660,
    rating: 4,
    reviews: 55,
    image: "https://m.media-amazon.com/images/I/61FNrdWeScL._AC_UF894,1000_QL80_.jpg",
    isNew: true,
  },
  {
    id: 8,
    name: "Quilted Satin Jacket",
    price: 660,
    rating: 4,
    reviews: 55,
    image: "https://m.media-amazon.com/images/I/61FNrdWeScL._AC_UF894,1000_QL80_.jpg",
    isNew: false,
  },
];

export default function ProductGrid() {
  return (
    <div className="max-w-7xl mx-auto py-10 grid md:grid-cols-4 gap-6">
      {products.map((product) => (
        <div key={product.id} className="border p-4 rounded-lg relative bg-white">
          {product.isNew && (
            <span className="absolute top-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded">NEW</span>
          )}
          <div className="flex justify-between items-center">
            <FaHeart className="text-gray-500 cursor-pointer" />
            <FaEye className="text-gray-500 cursor-pointer" />
          </div>
          <img src={product.image} alt={product.name} className="w-full h-40 object-contain mt-2" />
          <h3 className="mt-3 text-lg font-semibold">{product.name}</h3>
          <p className="text-red-500 font-bold">৳{product.price}</p>
          <div className="flex items-center space-x-1 text-yellow-400">
            {[...Array(5)].map((_, index) => (
              <FaStar key={index} className={index < product.rating ? "text-yellow-400" : "text-gray-300"} />
            ))}
            <span className="text-gray-500 text-sm">({product.reviews})</span>
          </div>
          <button className="mt-3 bg-black text-white py-2 w-full flex justify-center items-center space-x-2">
            <FaShoppingCart /> <span>Add To Cart</span>
          </button>
        </div>
      ))}
    </div>
  );
}
