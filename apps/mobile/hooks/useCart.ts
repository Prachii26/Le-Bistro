import { useCartStore } from '../store/cartStore';
import { MenuItem } from '../types';

export const useCart = () => {
  const items = useCartStore((s) => s.items);
  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart = useCartStore((s) => s.clearCart);
  const getItemQuantity = useCartStore((s) => s.getItemQuantity);
  const totalItems = useCartStore((s) => s.totalItems());
  const subtotal = useCartStore((s) => s.subtotal());
  const serviceCharge = useCartStore((s) => s.serviceCharge());
  const tax = useCartStore((s) => s.tax());
  const total = useCartStore((s) => s.total());

  return {
    items,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getItemQuantity,
    totalItems,
    subtotal,
    serviceCharge,
    tax,
    total,
  };
};
