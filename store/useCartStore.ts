import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Share structure configurations with our CartItem layouts
export interface CartProduct {
  id: string;
  name: string;
  price: string;
  quantity: number;
  image?: string;
  status?: string; // e.g., 'Rent', 'Sell', 'Lease'
}

interface CartState {
  items: CartProduct[];
  /** Adds an item to the cart or increments the count if it already exists */
  addToCart: (product: Omit<CartProduct, 'quantity'>) => void;
  /** Decrements the item count or removes it entirely if the count drops below 1 */
  removeFromCart: (id: string) => void;
  /** Completely purges a specific item row regardless of its current quantity */
  clearItemRow: (id: string) => void;
  /** Fully resets the cart back to an empty state */
  clearCart: () => void;
  /** Utility getter to quickly calculate the total number of items currently in the cart */
  getTotalItemCount: () => number;
  /** Utility getter to calculate the total checkout balance string */
  getCartTotal: () => string;
}

const STORAGE_CART_KEY = '@AccessibilityPro:Cart_State';

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],

      addToCart: (product) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex((item) => item.id === product.id);

          if (existingItemIndex > -1) {
            // If the item exists, increase its quantity safely
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex] = {
              ...updatedItems[existingItemIndex],
              quantity: updatedItems[existingItemIndex].quantity + 1,
            };
            return { items: updatedItems };
          }

          // If it's a new item, add it to the cart with a starting quantity of 1
          return { items: [...state.items, { ...product, quantity: 1 }] };
        });
      },

      removeFromCart: (id) => {
        set((state) => {
          const existingItemIndex = state.items.findIndex((item) => item.id === id);

          if (existingItemIndex > -1) {
            const currentItem = state.items[existingItemIndex];
            
            if (currentItem.quantity <= 1) {
              // Remove the item completely if its quantity drops to zero
              return { items: state.items.filter((item) => item.id !== id) };
            }

            // Otherwise, decrement the quantity by 1
            const updatedItems = [...state.items];
            updatedItems[existingItemIndex] = {
              ...currentItem,
              quantity: currentItem.quantity - 1,
            };
            return { items: updatedItems };
          }

          return state;
        });
      },

      clearItemRow: (id) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },

      clearCart: () => set({ items: [] }),

      getTotalItemCount: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },

      getCartTotal: () => {
        const total = get().items.reduce((sum, item) => {
          // Clean the price string to safely extract numbers (e.g., "$4,500" -> 4500)
          const numericPrice = parseFloat(item.price.replace(/[^0-9.]/g, '')) || 0;
          return sum + (numericPrice * item.quantity);
        }, 0);

        // Format the currency nicely for display panels
        return `$${total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
      },
    }),
    {
      name: STORAGE_CART_KEY,
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);