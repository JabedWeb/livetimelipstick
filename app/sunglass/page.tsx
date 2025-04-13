import Shop_grid from '@/components/Sunglass/Shop_grid'
import { SunglassProvider } from '@/context/SunglassContext'
import React from 'react'

const page = () => {
  return (
    <div>
        <>
        <SunglassProvider>
            <Shop_grid />
        </SunglassProvider>
        </>
    </div>
  )
}

export default page