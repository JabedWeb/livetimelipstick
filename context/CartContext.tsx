"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import {
  addToCart,
  clearCart,
  getCart,
  removeCartItem,
  updateCartItem,
} from "@/utilities/cartUtils";

// Define Product and CartItem types
export interface Product {
  id: string;
  name: string;
  price: number;
  image?: string;
  [key: string]: any; // allow extra fields
}

export interface CartItem extends Product {
  quantity: number;
  totalPrice: number;
}

// Define the context type
interface CartContextType {
  cartItems: CartItem[];
  totalItems: number;
  totalPrice: number;
  handleAddToCart: (product: Product, quantity?: number) => void;
  handleUpdateCartItem: (productId: string, quantity: number) => void;
  handleRemoveCartItem: (productId: string) => void;
  handleClearCart: () => void;
}

// Create context with default undefined
const CartContext = createContext<CartContextType | undefined>(undefined);

// Props for CartProvider
interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);
  const [totalPrice, setTotalPrice] = useState<number>(0);

  useEffect(() => {
    const cart = getCart();
    setCartItems(cart);
    calculateTotals(cart);
  }, []);

  const calculateTotals = (cart: CartItem[]) => {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.totalPrice, 0);

    setTotalItems(totalItems);
    setTotalPrice(totalPrice);
  };

  const handleAddToCart = (product: Product, quantity: number = 1) => {
    addToCart(product, quantity);
    const updatedCart = getCart();
    setCartItems(updatedCart);
    calculateTotals(updatedCart);
  };

  const handleUpdateCartItem = (productId: string, quantity: number) => {
    updateCartItem(productId, quantity);
    const updatedCart = getCart();
    setCartItems(updatedCart);
    calculateTotals(updatedCart);
  };

  const handleRemoveCartItem = (productId: string) => {
    removeCartItem(productId);
    const updatedCart = getCart();
    setCartItems(updatedCart);
    calculateTotals(updatedCart);
  };

  const handleClearCart = () => {
    clearCart();
    setCartItems([]);
    setTotalItems(0);
    setTotalPrice(0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItems,
        totalPrice,
        handleAddToCart,
        handleUpdateCartItem,
        handleRemoveCartItem,
        handleClearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
