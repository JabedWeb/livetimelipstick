// utils/CartHandler.ts

export interface CartItem {
  id: number;
  title: string;
  price: number;
  image: string;
  quantity: number;
}

const STORAGE_KEY = "laundryCart";

export const loadCart = (): CartItem[] => {
  const stored = localStorage.getItem(STORAGE_KEY);
  return stored ? JSON.parse(stored) : [];
};

export const saveCart = (cart: CartItem[]) => {
  const filtered = cart.filter(item => item.quantity >= 1);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
};

export const updateCartItem = (
  cart: CartItem[],
  product: Omit<CartItem, "quantity">,
  quantity: number
): CartItem[] => {
  if (quantity < 1) {
    return cart.filter(item => item.id !== product.id);
  }

  const exists = cart.find(item => item.id === product.id);
  if (exists) {
    return cart.map(item =>
      item.id === product.id ? { ...item, quantity } : item
    );
  } else {
    return [...cart, { ...product, quantity }];
  }
};
