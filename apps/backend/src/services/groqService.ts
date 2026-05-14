import Groq from 'groq-sdk';
import { MENU_ITEMS } from '../data/menu';
import { AIResponse, AIAction } from '../types';

const client = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

// Groq model to use — fast, free, and smart enough for JSON parsing
const MODEL = 'llama-3.3-70b-versatile';

interface ProcessMessageParams {
  message: string;
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }>;
  currentCart: Array<{
    itemId: string;
    name: string;
    quantity: number;
    price: number;
  }>;
}

function buildSystemPrompt(
  currentCart: ProcessMessageParams['currentCart']
): string {
  const cartIsEmpty = currentCart.length === 0;

  return `You are Bistro, a warm and knowledgeable AI waiter for Le Bistro — a modern, plant-forward fine dining restaurant. Be concise (under 60 words per reply), friendly, and helpful.

FULL MENU (JSON):
${JSON.stringify(MENU_ITEMS, null, 2)}

CUSTOMER'S CURRENT CART:
${cartIsEmpty ? 'Cart is empty.' : JSON.stringify(currentCart, null, 2)}

CRITICAL — RESPONSE FORMAT:
You MUST respond with ONLY a raw JSON object. No markdown. No code blocks. No backticks. No explanation. Just the JSON.

Required schema:
{
  "message": "your natural language response here",
  "actions": [
    {
      "type": "ADD_ITEM or REMOVE_ITEM or UPDATE_QUANTITY or CLEAR_CART",
      "itemId": "item-XX",
      "quantity": 1
    }
  ]
}

RULES:
- actions must be [] if no cart changes are needed
- Only use itemIds that exist in the menu above (item-01 through item-12)
- Confirm every cart action naturally in the message field
- Never invent prices, items, or allergen info
- For allergen questions answer precisely from the data above
- Keep responses under 60 words
- Occasionally use 🌿 or 🍃 to sign off`;
}

export async function processMessage({
  message,
  conversationHistory,
  currentCart,
}: ProcessMessageParams): Promise<AIResponse> {
  // Limit history to last 10 turns to control token usage
  const history = conversationHistory.slice(-10);

  const messages = [
    ...history,
    { role: 'user' as const, content: message },
  ];

  const response = await client.chat.completions.create({
    model: MODEL,
    max_tokens: 1024,
    temperature: 0.7,
    messages: [
      {
        role: 'system',
        content: buildSystemPrompt(currentCart),
      },
      ...messages,
    ],
  });

  const rawText = response.choices[0]?.message?.content ?? '';

  // Robust JSON parsing with fallback — never crash the app
  try {
    // Strip accidental markdown fences Llama sometimes adds
    const cleaned = rawText
      .replace(/```json/gi, '')
      .replace(/```/g, '')
      .trim();

    // Extract JSON object if wrapped in extra text
    const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
    if (!jsonMatch) throw new Error('No JSON object found in response');

    const parsed = JSON.parse(jsonMatch[0]) as AIResponse;

    // Validate structure — ensure actions is always an array
    if (!parsed.message) parsed.message = 'How can I help you?';
    if (!Array.isArray(parsed.actions)) parsed.actions = [];

    // Validate each action has required fields
    parsed.actions = parsed.actions.filter(
      (a: AIAction) =>
        a.type && ['ADD_ITEM', 'REMOVE_ITEM', 'UPDATE_QUANTITY', 'CLEAR_CART'].includes(a.type)
    );

    return parsed;
  } catch {
    // Graceful fallback — show raw text as message, no cart actions
    return {
      message: rawText || "Sorry, I didn't catch that. Could you try rephrasing?",
      actions: [],
    };
  }
}
