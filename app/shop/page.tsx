import Sunglasses from '@/components/DontTouch/Sunglasses'
import FaceLandmarkerSunglassComponent from '@/components/Sunglass/FaceLandmarkerSunglassComponent'
import SingleSunglass from '@/components/Sunglass/SingleSunglass'
import { SunglassProvider } from '@/context/SunglassContext'
import React from 'react'

const page = () => {
  return (
    <div>
      <SunglassProvider>
      <h2>Try On Sunglasses</h2>
      <SingleSunglass />
      <FaceLandmarkerSunglassComponent />
    </SunglassProvider>
    </div>
  )
}

export default page