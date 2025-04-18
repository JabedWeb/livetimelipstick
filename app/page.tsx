
import ProductGrid from "@/components/Grid";
import { LipstickProvider } from "@/context/ColorContext";


export default function Home() {
  return (
    <div>
      <LipstickProvider>
           <ProductGrid />
      </LipstickProvider>
    </div>
  );
}
