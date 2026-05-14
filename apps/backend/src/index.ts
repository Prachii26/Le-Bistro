import 'dotenv/config';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import morgan from 'morgan';
import aiRouter from './routes/ai';

const app = express();

const corsOptions: cors.CorsOptions = {
  origin: [
    'http://localhost:8081',
    'http://localhost:19006',
    /^http:\/\/192\.168\.\d+\.\d+:\d+$/,
  ],
  methods: ['GET', 'POST'],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json({ limit: '10kb' }));
app.use(morgan('dev'));

app.get('/health', (_req: Request, res: Response) => {
  res.json({ status: 'ok', timestamp: new Date() });
});

app.use('/api/ai', aiRouter);

app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
  console.error('[server] Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

const PORT = process.env.PORT ?? 3001;
app.listen(PORT, () => {
  console.log(`Le Bistro backend running on http://localhost:${PORT}`);
});

export default app;
