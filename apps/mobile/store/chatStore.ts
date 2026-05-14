import { create } from 'zustand';
import { ChatStore, ChatMessage } from '../types';

const GREETING: ChatMessage = {
  id: 'greeting',
  role: 'assistant',
  content:
    "Hi! I'm Bistro, your AI waiter 🌿 I can help you browse the menu, answer questions about dishes, or take your order. What are you in the mood for today?",
  timestamp: new Date(),
};

export const useChatStore = create<ChatStore>((set) => ({
  messages: [GREETING],
  isLoading: false,

  addMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => {
    const newMessage: ChatMessage = {
      ...msg,
      id: `msg_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      timestamp: new Date(),
    };
    set((state) => ({ messages: [...state.messages, newMessage] }));
  },

  setLoading: (val: boolean) => set({ isLoading: val }),

  clearChat: () => set({ messages: [GREETING] }),
}));
