import LaundryBooking from "@/components/Booking/LaundryBooking";
import ProductGrid from "@/components/Grid";
import ProductPage from "@/components/ProductPage";
import { LipstickProvider } from "@/context/ColorContext";


export default function Home() {
  return (
    <div>
      {/* <FaceLandmarkerComponent /> */}
      {/* <ProductPage /> */}
      <LaundryBooking />
      <LipstickProvider>
           <ProductGrid />
      </LipstickProvider>
    </div>
  );
}
