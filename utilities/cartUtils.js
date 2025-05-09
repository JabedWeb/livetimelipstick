// Get cart from localStorage
export const getCart = () => JSON.parse(localStorage.getItem("cart")) || [];

// Save cart to localStorage
export const saveCart = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

// Add a product to cart (with variation like color/frame)
export const addToCart = (product, quantity = 1) => {
  const cart = getCart();

  // Match by ID and variation only
  const isSameProduct = (a, b) => a.id === b.id && a.variation === b.variation;

  const existingIndex = cart.findIndex((item) => isSameProduct(item, product));

  if (existingIndex >= 0) {
    cart[existingIndex].quantity += quantity;
    cart[existingIndex].totalPrice += product.price * quantity;
  } else {
    cart.push({
      ...product,
      quantity,
      totalPrice: product.price * quantity,
    });
  }

  saveCart(cart);
};

// Update quantity for a specific variation
export const updateCartItem = (targetItem, quantity) => {
  const cart = getCart();

  const isSameProduct = (a, b) => a.id === b.id && a.variation === b.variation;

  const index = cart.findIndex((item) => isSameProduct(item, targetItem));

  if (index >= 0) {
    if (quantity > 0) {
      cart[index].quantity = quantity;
      cart[index].totalPrice = cart[index].price * quantity;
    } else {
      cart.splice(index, 1);
    }
    saveCart(cart);
  }
};

// Remove a specific variation
export const removeCartItem = (targetItem) => {
  const cart = getCart();

  const isSameProduct = (a, b) => a.id === b.id && a.variation === b.variation;

  const updatedCart = cart.filter((item) => !isSameProduct(item, targetItem));
  saveCart(updatedCart);
};

// Clear the cart
export const clearCart = () => {
  localStorage.removeItem("cart");
};
