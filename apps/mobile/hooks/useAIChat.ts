import { useCallback } from 'react';
import axios from 'axios';
import { useChatStore } from '../store/chatStore';
import { useCartStore } from '../store/cartStore';
import { MENU_ITEMS } from '../data/menu';
import { API_BASE_URL } from '../constants/api';
import { AIResponse } from '../types';

export const useAIChat = () => {
  const addMessage = useChatStore((s) => s.addMessage);
  const setLoading = useChatStore((s) => s.setLoading);
  const messages = useChatStore((s) => s.messages);
  const isLoading = useChatStore((s) => s.isLoading);
  const addItem = useCartStore((s) => s.addItem);
  const removeItem = useCartStore((s) => s.removeItem);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const clearCart = useCartStore((s) => s.clearCart);
  const cartItems = useCartStore((s) => s.items);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!text.trim() || isLoading) return;

      const userMessage = text.trim();
      addMessage({ role: 'user', content: userMessage });
      setLoading(true);

      try {
        const conversationHistory = messages
          .filter((m) => m.role !== 'system')
          .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));

        const currentCart = cartItems.map((i) => ({
          itemId: i.menuItem.id,
          name: i.menuItem.name,
          quantity: i.quantity,
          price: i.menuItem.price,
        }));

        const response = await axios.post<AIResponse>(
          `${API_BASE_URL}/api/ai/chat`,
          { message: userMessage, conversationHistory, currentCart },
          { timeout: 30000 }
        );

        addMessage({ role: 'assistant', content: response.data.message });

        for (const action of response.data.actions) {
          switch (action.type) {
            case 'ADD_ITEM': {
              const menuItem = MENU_ITEMS.find((m) => m.id === action.itemId);
              if (menuItem) {
                addItem(menuItem, action.quantity ?? 1);
                addMessage({
                  role: 'system',
                  content: `Added: ${action.quantity ?? 1}× ${menuItem.name} 🌿`,
                });
              }
              break;
            }
            case 'REMOVE_ITEM':
              if (action.itemId) removeItem(action.itemId);
              break;
            case 'UPDATE_QUANTITY':
              if (action.itemId && action.quantity != null) {
                updateQuantity(action.itemId, action.quantity);
              }
              break;
            case 'CLEAR_CART':
              clearCart();
              break;
          }
        }
      } catch {
        addMessage({
          role: 'system',
          content: 'Something went wrong. Please try again.',
        });
      } finally {
        setLoading(false);
      }
    },
    [
      isLoading,
      messages,
      cartItems,
      addMessage,
      setLoading,
      addItem,
      removeItem,
      updateQuantity,
      clearCart,
    ]
  );

  return { sendMessage };
};
