// apps/api/src/routes/health.ts

import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
    res.json({
        status: 'ok',
        message: 'API server is running',
        time: new Date().toISOString(),
        env: process.env.NODE_ENV || 'development',
    });
});

export default router;