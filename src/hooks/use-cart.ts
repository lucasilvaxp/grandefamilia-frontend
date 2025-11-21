"use client";

import { useState, useEffect, useCallback } from 'react';
import { CartItem, Product, Color } from '@/types/product';

const CART_STORAGE_KEY = 'fashion-cart';

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(CART_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        console.log('Cart loaded from localStorage:', parsed);
        setCart(parsed);
      }
    } catch (error) {
      console.error('Error loading cart:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save cart to localStorage whenever it changes (ONLY after loaded)
  useEffect(() => {
    if (isLoaded) {
      console.log('Saving cart to localStorage:', cart);
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
      } catch (error) {
        console.error('Error saving cart:', error);
      }
    }
  }, [cart, isLoaded]);

  const addToCart = useCallback((
    product: Product,
    quantity: number,
    selectedSize?: string,
    selectedColor?: Color
  ) => {
    console.log('Adding to cart:', { product, quantity, selectedSize, selectedColor });
    
    setCart(prevCart => {
      // Check if item already exists
      const existingIndex = prevCart.findIndex(
        item =>
          item.product.id === product.id &&
          item.selectedSize === selectedSize &&
          item.selectedColor?.hex === selectedColor?.hex
      );

      let newCart: CartItem[];
      
      if (existingIndex > -1) {
        // Update quantity
        newCart = [...prevCart];
        newCart[existingIndex] = {
          ...newCart[existingIndex],
          quantity: newCart[existingIndex].quantity + quantity
        };
        console.log('Updated existing item in cart');
      } else {
        // Add new item
        newCart = [...prevCart, { product, quantity, selectedSize, selectedColor }];
        console.log('Added new item to cart');
      }

      console.log('New cart state:', newCart);
      return newCart;
    });
  }, []);

  const removeFromCart = useCallback((index: number) => {
    console.log('Removing item at index:', index);
    setCart(prevCart => prevCart.filter((_, i) => i !== index));
  }, []);

  const updateQuantity = useCallback((index: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(index);
      return;
    }

    console.log('Updating quantity at index:', index, 'to:', quantity);
    setCart(prevCart => {
      const newCart = [...prevCart];
      newCart[index] = { ...newCart[index], quantity };
      return newCart;
    });
  }, [removeFromCart]);

  const clearCart = useCallback(() => {
    console.log('Clearing cart');
    setCart([]);
  }, []);

  const total = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  const itemCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    total,
    itemCount,
    isLoaded,
  };
}
