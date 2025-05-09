import type { Metadata } from "next";
import {Jost, Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Common/Header";
import Footer from "@/components/Common/Footer";
import { LipstickProvider } from "@/context/ColorContext";
import { SunglassProvider } from "@/context/SunglassContext";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";

const jost = Jost({
  subsets: ["latin"],
});


export const metadata: Metadata = {
  title: "Virtual Try-On",
  description: "Bulk Buy is a virtual try-on platform for sunglasses and lipsticks.",
  keywords: [
    "virtual try-on",
    "sunglasses",
    "lipsticks",
    "3D customization",
    "webcam try-on",
    "e-commerce",
    "fashion technology",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
     <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>

      <body
        className={` ${jost.className} bg-black antialiased`}
      >

        
       <AuthProvider>
        <CartProvider  >
         <SunglassProvider>
          <LipstickProvider>
          <Navbar />
             {children}
          <Footer />
        </LipstickProvider>
        </SunglassProvider>
       </CartProvider>
       </AuthProvider>
      </body>
    </html>
  );
}
