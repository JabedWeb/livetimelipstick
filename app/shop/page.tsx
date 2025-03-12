import Shop_grid from '@/components/Shop/Shop_grid'
import SingleLipstic from '@/components/Shop/SingleLipstic'
import SingleProduct from '@/components/Shop/SingleProduct'
import { LipstickProvider } from '@/context/ColorContext'
import React from 'react'

const page = () => {
  return (
    <div>
        {/* <Shop_grid /> */}
        {/* <SingleProduct /> */}
        <LipstickProvider>
           <SingleLipstic />
        </LipstickProvider>
       
    </div>
  )
}

export default page