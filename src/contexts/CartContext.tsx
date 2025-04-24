
import React, { createContext, useState, useContext, useEffect } from 'react';
import { CartItem, Seat } from '@/types';
import { toast } from 'sonner';

interface CartContextType {
  cart: CartItem[];
  addToCart: (eventId: string, seats: Seat[]) => void;
  removeFromCart: (eventId: string, seatIds: string[]) => void;
  clearCart: () => void;
  getCartTotal: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);

  // Load cart from local storage on initial render
  useEffect(() => {
    const savedCart = localStorage.getItem('cart');
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart));
      } catch (error) {
        console.error('Failed to parse cart from localStorage:', error);
      }
    }
  }, []);

  // Save cart to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (eventId: string, seats: Seat[]) => {
    setCart(prevCart => {
      // Check if event already exists in cart
      const existingCartItem = prevCart.find(item => item.eventId === eventId);
      
      if (existingCartItem) {
        // Add seats to existing cart item
        const updatedSeats = [...existingCartItem.seats];
        
        // Filter out any seats that are already in the cart
        const newSeats = seats.filter(seat => 
          !existingCartItem.seats.some(s => s.id === seat.id)
        );
        
        if (newSeats.length === 0) {
          toast.error('These seats are already in your cart');
          return prevCart;
        }
        
        updatedSeats.push(...newSeats);
        
        toast.success(`Added ${newSeats.length} seat(s) to your cart`);
        
        return prevCart.map(item => 
          item.eventId === eventId ? { ...item, seats: updatedSeats } : item
        );
      } else {
        // Create new cart item
        toast.success(`Added ${seats.length} seat(s) to your cart`);
        return [...prevCart, { eventId, seats }];
      }
    });
  };

  const removeFromCart = (eventId: string, seatIds: string[]) => {
    setCart(prevCart => {
      const cartItem = prevCart.find(item => item.eventId === eventId);
      if (!cartItem) return prevCart;
      
      const updatedSeats = cartItem.seats.filter(
        seat => !seatIds.includes(seat.id)
      );
      
      if (updatedSeats.length === 0) {
        // Remove entire cart item if no seats left
        toast.info('Removed seats from cart');
        return prevCart.filter(item => item.eventId !== eventId);
      } else {
        // Update seats in cart item
        toast.info('Removed seats from cart');
        return prevCart.map(item => 
          item.eventId === eventId ? { ...item, seats: updatedSeats } : item
        );
      }
    });
  };

  const clearCart = () => {
    setCart([]);
    toast.info('Cart cleared');
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      const itemTotal = item.seats.reduce((sum, seat) => sum + seat.price, 0);
      return total + itemTotal;
    }, 0);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, getCartTotal }}>
      {children}
    </CartContext.Provider>
  );
};
