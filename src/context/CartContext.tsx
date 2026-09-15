/**
 * Cart Context & Provider
 * Manages cart state, quantity controls, coupon discounts, delivery fees, and order calculations.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product, Offer } from '../types';
import { STORE_CONFIG } from '../config/store';
import { api } from '../services/api';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: string) => void;
  updateQuantity: (productId: string, delta: number) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  deliveryFee: number;
  discount: number;
  grandTotal: number;
  appliedCoupon: Offer | null;
  couponError: string | null;
  applyCoupon: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'general_store_cart_v1';
const COUPON_STORAGE_KEY = 'general_store_coupon_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<Offer | null>(() => {
    try {
      const saved = localStorage.getItem(COUPON_STORAGE_KEY);
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [couponError, setCouponError] = useState<string | null>(null);

  // Persist cart
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch {
      // Ignore
    }
  }, [cart]);

  // Persist coupon
  useEffect(() => {
    try {
      if (appliedCoupon) {
        localStorage.setItem(COUPON_STORAGE_KEY, JSON.stringify(appliedCoupon));
      } else {
        localStorage.removeItem(COUPON_STORAGE_KEY);
      }
    } catch {
      // Ignore
    }
  }, [appliedCoupon]);

  const addToCart = (product: Product, quantity = 1) => {
    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(item => item.product.id === product.id);
      if (existingIndex > -1) {
        const updated = [...prevCart];
        const newQty = updated[existingIndex].quantity + quantity;
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: Math.min(product.stock, newQty),
        };
        return updated;
      }
      return [...prevCart, { product, quantity: Math.min(product.stock, Math.max(1, quantity)) }];
    });
  };

  const removeFromCart = (productId: string) => {
    setCart(prev => prev.filter(item => item.product.id !== productId));
  };

  const updateQuantity = (productId: string, delta: number) => {
    setCart(prev =>
      prev
        .map(item => {
          if (item.product.id === productId) {
            const newQty = item.quantity + delta;
            if (newQty <= 0) return null;
            return {
              ...item,
              quantity: Math.min(item.product.stock, newQty),
            };
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const setQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart(prev =>
      prev.map(item => {
        if (item.product.id === productId) {
          return {
            ...item,
            quantity: Math.min(item.product.stock, quantity),
          };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    setCouponError(null);
  };

  const applyCoupon = async (code: string): Promise<boolean> => {
    setCouponError(null);
    if (!code || !code.trim()) {
      setCouponError('Please enter a coupon code.');
      return false;
    }

    try {
      const res = await api.getActiveOffers();
      if (res.success) {
        const found = res.offers.find(o => o.code.toUpperCase() === code.trim().toUpperCase());
        if (!found) {
          setCouponError('Invalid or expired coupon code.');
          return false;
        }

        if (subtotal < found.minPurchase) {
          setCouponError(`This coupon requires a minimum purchase of $${found.minPurchase.toFixed(2)}.`);
          return false;
        }

        setAppliedCoupon(found);
        return true;
      }
      return false;
    } catch {
      setCouponError('Could not validate coupon. Please try again.');
      return false;
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setCouponError(null);
  };

  // Calculations
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);

  const subtotal = parseFloat(
    cart
      .reduce((sum, item) => {
        const price = item.product.discountPrice || item.product.price;
        return sum + price * item.quantity;
      }, 0)
      .toFixed(2)
  );

  let deliveryFee = 0;
  if (cart.length > 0) {
    if (subtotal >= STORE_CONFIG.delivery.freeDeliveryThreshold) {
      deliveryFee = 0;
    } else if (appliedCoupon?.code.toUpperCase() === 'FREESHIP') {
      deliveryFee = 0;
    } else {
      deliveryFee = STORE_CONFIG.delivery.standardDeliveryFee;
    }
  }

  let discount = 0;
  if (appliedCoupon && appliedCoupon.code.toUpperCase() !== 'FREESHIP') {
    discount = parseFloat(((subtotal * appliedCoupon.discountPercent) / 100).toFixed(2));
  }

  const grandTotal = parseFloat(Math.max(0, subtotal + deliveryFee - discount).toFixed(2));

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        setQuantity,
        clearCart,
        totalItems,
        subtotal,
        deliveryFee,
        discount,
        grandTotal,
        appliedCoupon,
        couponError,
        applyCoupon,
        removeCoupon,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
