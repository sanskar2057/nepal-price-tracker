// apps/api/src/routes/products.ts

import { Router } from 'express';
import prisma from '../lib/prisma';

const router = Router();

// GET /products - Fetch latest 12 products with their most recent price
router.get('/', async (req, res) => {
    try {
        const products = await prisma.product.findMany({
            take: 12,
            orderBy: {
                createdAt: 'desc', // newest first
            },
            include: {
                prices: {
                    take: 1, // only the latest price per product
                    orderBy: {
                        scrapedAt: 'desc',
                    },
                    select: {
                        priceNpr: true,
                        originalPriceNpr: true,
                        url: true,
                        scrapedAt: true,
                        stockStatus: true,
                    },
                },
            },
            where: {
                categorySlug: 'smartphones', // filter to phones (remove if you want all)
            },
        });

        // Format response to match frontend type expectations
        const formatted = products.map((p) => ({
            id: p.id,
            name: p.name,
            slug: p.slug,
            mainImageUrl: p.mainImageUrl,
            categorySlug: p.categorySlug,
            createdAt: p.createdAt.toISOString(),
            updatedAt: p.updatedAt.toISOString(),
            latestPrice: p.prices[0]
                ? {
                    priceNpr: p.prices[0].priceNpr,
                    originalPriceNpr: p.prices[0].originalPriceNpr ?? null,
                    url: p.prices[0].url,
                    scrapedAt: p.prices[0].scrapedAt.toISOString(),
                    stockStatus: p.prices[0].stockStatus ?? 'unknown',
                }
                : null,
        }));

        res.json({
            success: true,
            data: formatted,
            count: formatted.length,
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch products from database',
        });
    }
});

export default router;