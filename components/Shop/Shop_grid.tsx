import React from 'react'
import { FaStar } from "react-icons/fa";


const Shop_grid = () => {
  const products=[
    {
      id : 1,
      name : "Sunglasses for man and women",
      description : " This is the best sunglasses for all ages . It is very comfortable and stylish. It is made of high quality material. It is very light weight and easy to carry. It is available in different colors. It is perfect for all occasions. It is a perfect gift for your loved ones. It is a must have accessory for all fashion lovers. It is a perfect addition to your wardrobe",
      price : 100,
      image : "https://i0.wp.com/specsmart.in/wp-content/uploads/2022/06/Silver-Metal-Blue-Gradient-Medium-Aviator-Sunglass-1.jpg" ,
      reviewCount: 24,
      rating: 5
    },
    {
      id : 2,
      name : "Jr. Zoom Soccer Cleats",
      description : "This is the best soccer cleats for kids. It is very comfortable and stylish. It is made of high quality material. It is very light weight and easy to carry. It is available in different colors. It is perfect for all occasions. It is a perfect gift for your loved ones. It is a must have accessory for all soccer lovers. It is a perfect addition to your wardrobe",
      price : 50,
      image : "https://i0.wp.com/specsmart.in/wp-content/uploads/2022/06/Silver-Metal-Blue-Gradient-Medium-Aviator-Sunglass-1.jpg"  ,
      reviewCount: 18,
      rating: 3
    },
    {
      id :3,
      name : "Kids Electric Car",
      description : "This is the best electric car for kids. It is very comfortable and stylish. It is made of high quality material. It is very light weight and easy to carry. It is available in different colors. It is perfect for all occasions. It is a perfect gift for your loved ones. It is a must have accessory for all kids. It is a perfect addition to your wardrobe",
      price : 200,
      image : "https://i0.wp.com/specsmart.in/wp-content/uploads/2022/06/Silver-Metal-Blue-Gradient-Medium-Aviator-Sunglass-1.jpg"  ,
      reviewCount: 12,
      rating: 2
    }

  ]




  return (
    <div>
      <div className='grid md:grid-cols-3 '>
        {
          products.map((product,index)=>
          <div key={index} className='border p-4 m-4 relative group'>
            <div >
              <img src={product.image} alt={product.name} className='w-full'/>
            </div>
            <button className='bg-black hidden absolute left-0 bottom-[100px] group-hover:block text-white inline-block w-full py-2 px-2 rounded-md'>Add To Cart</button>
            <h1 className='text-lg font-semibold mt-4'>{product.name}</h1>
            <div className='flex items-center'>
          
              {Array.from({ length: product.rating }).map((_, i) => (
                <FaStar className='text-orange-500' key={`filled-${i}`} />
              ))}
              
              {product.rating < 5 &&
                Array.from({ length: 5 - product.rating }).map((_, i) => (
                  <FaStar className='text-gray-500' key={`empty-${i}`} />
                ))
              }
  
              <span>({product.reviewCount})</span>
            </div>

            <p className='text-lg font-bold'>${product.price}</p>
            </div>
            )
        }
      </div>
    </div>
  )
}

export default Shop_grid