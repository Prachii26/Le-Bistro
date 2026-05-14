import { create } from 'zustand';
import { CartStore, MenuItem, CartItem } from '../types';

export const useCartStore = create<CartStore>((set, get) => ({
  items: [],

  addItem: (menuItem: MenuItem, qty = 1) => {
    set((state) => {
      const existing = state.items.find((i) => i.menuItem.id === menuItem.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.menuItem.id === menuItem.id
              ? { ...i, quantity: i.quantity + qty }
              : i
          ),
        };
      }
      return { items: [...state.items, { menuItem, quantity: qty }] };
    });
  },

  removeItem: (itemId: string) => {
    set((state) => ({
      items: state.items.filter((i) => i.menuItem.id !== itemId),
    }));
  },

  updateQuantity: (itemId: string, qty: number) => {
    if (qty <= 0) {
      get().removeItem(itemId);
      return;
    }
    set((state) => ({
      items: state.items.map((i) =>
        i.menuItem.id === itemId ? { ...i, quantity: qty } : i
      ),
    }));
  },

  clearCart: () => set({ items: [] }),

  getItemQuantity: (itemId: string) => {
    const item = get().items.find((i) => i.menuItem.id === itemId);
    return item ? item.quantity : 0;
  },

  totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),

  subtotal: () =>
    get().items.reduce((sum, i) => sum + i.menuItem.price * i.quantity, 0),

  serviceCharge: () => get().subtotal() * 0.1,

  tax: () => get().subtotal() * 0.085,

  total: () => get().subtotal() + get().serviceCharge() + get().tax(),
}));
