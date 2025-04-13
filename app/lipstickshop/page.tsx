
import Shop_grid from '@/components/Grid'
import SingleLipstic from '@/components/Lipstick/SingleLipstick'
import SingleProduct from '@/components/Shop/SingleProduct'
import { LipstickProvider } from '@/context/ColorContext'
import React from 'react'

const page = () => {
  return (
    <div>
        <LipstickProvider>
          <Shop_grid />
           {/* <SingleLipstic /> */}
        </LipstickProvider>
       
    </div>
  )
}

export default page