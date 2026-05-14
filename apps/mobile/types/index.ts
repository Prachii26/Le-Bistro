export type MenuCategory = 'starter' | 'main' | 'drink' | 'dessert';
export type MenuTag = 'Popular' | "Chef's Pick" | 'Vegan' | 'New' | 'Spicy';

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: MenuCategory;
  emoji: string;
  tags: MenuTag[];
  calories: number;
  allergens: string[];
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export type AIActionType =
  | 'ADD_ITEM'
  | 'REMOVE_ITEM'
  | 'UPDATE_QUANTITY'
  | 'CLEAR_CART';

export interface AIAction {
  type: AIActionType;
  itemId: string;
  quantity?: number;
}

export interface AIResponse {
  message: string;
  actions: AIAction[];
}

export interface CartStore {
  items: CartItem[];
  addItem: (menuItem: MenuItem, qty?: number) => void;
  removeItem: (itemId: string) => void;
  updateQuantity: (itemId: string, qty: number) => void;
  clearCart: () => void;
  getItemQuantity: (itemId: string) => number;
  totalItems: () => number;
  subtotal: () => number;
  serviceCharge: () => number;
  tax: () => number;
  total: () => number;
}

export interface ChatStore {
  messages: ChatMessage[];
  isLoading: boolean;
  addMessage: (msg: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  setLoading: (val: boolean) => void;
  clearChat: () => void;
}
