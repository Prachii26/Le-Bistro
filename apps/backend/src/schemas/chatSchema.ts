import { z } from 'zod';

export const chatSchema = z.object({
  message: z.string().min(1).max(1000).trim(),
  conversationHistory: z
    .array(
      z.object({
        role: z.enum(['user', 'assistant']),
        content: z.string().max(2000),
      })
    )
    .max(20)
    .default([]),
  currentCart: z
    .array(
      z.object({
        itemId: z.string(),
        name: z.string(),
        quantity: z.number().int().positive().max(99),
        price: z.number().positive(),
      })
    )
    .default([]),
});

export type ChatSchemaInput = z.infer<typeof chatSchema>;
