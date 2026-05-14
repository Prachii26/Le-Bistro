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

export interface AIAction {
  type: 'ADD_ITEM' | 'REMOVE_ITEM' | 'UPDATE_QUANTITY' | 'CLEAR_CART';
  itemId: string;
  quantity?: number;
}

export interface AIResponse {
  message: string;
  actions: AIAction[];
}

export interface CartItemPayload {
  itemId: string;
  name: string;
  quantity: number;
  price: number;
}

export interface ConversationMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface ChatRequest {
  message: string;
  conversationHistory: ConversationMessage[];
  currentCart: CartItemPayload[];
}
