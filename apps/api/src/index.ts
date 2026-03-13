// apps/api/src/index.ts

import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

// Import routes
import healthRouter from './routes/health';
import productsRouter from './routes/products';
dotenv.config();

const app = express();
const PORT = Number(process.env.PORT) || 4000;

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

// Routes
app.use('/health', healthRouter);
app.use('/products', productsRouter);

// Catch-all 404
app.use((req, res) => {
    res.status(404).json({ error: 'Endpoint not found' });
});

// Error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something went wrong on the server' });
});

app.listen(PORT, () => {
    console.log(`🚀 API server running on http://localhost:${PORT}`);
    console.log(`Health check: http://localhost:${PORT}/health`);
});