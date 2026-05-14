import { Request, Response } from 'express';
import { chatSchema } from '../schemas/chatSchema';
import { processMessage } from '../services/groqService';

export async function handleChat(req: Request, res: Response): Promise<void> {
  const parsed = chatSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      error: 'Invalid request',
      issues: parsed.error.issues.map((i) => ({
        path: i.path.join('.'),
        message: i.message,
      })),
    });
    return;
  }

  const { message, conversationHistory, currentCart } = parsed.data;

  try {
    const result = await processMessage({
      message,
      conversationHistory,
      currentCart,
    });
    res.status(200).json(result);
  } catch (err: unknown) {
    console.error('[aiController] Error:', err);

    if (
      err instanceof Error &&
      (err.message.includes('anthropic') ||
        err.message.includes('API') ||
        err.constructor.name.includes('Anthropic'))
    ) {
      res.status(502).json({ error: 'AI service unavailable' });
      return;
    }

    res.status(500).json({ error: 'Internal server error' });
  }
}
