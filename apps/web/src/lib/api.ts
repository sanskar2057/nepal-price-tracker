// apps/web/src/lib/api.ts

import { ProductWithPrice } from "@/type/products";

const API_BASE = process.env.NODE_ENV === 'development'
    ? 'http://localhost:4000'
    : 'https://your-production-url.com'; // change later

interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    count?: number;
    timestamp?: string;
}

async function fetchApi<T>(endpoint: string): Promise<ApiResponse<T>> {
    const url = `${API_BASE}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;

    try {
        const res = await fetch(url, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
            cache: 'no-store', // or 'force-cache' if you want
        });

        if (!res.ok) {
            throw new Error(`HTTP error! Status: ${res.status}`);
        }

        const json = await res.json();
        return json as ApiResponse<T>;
    } catch (error) {
        console.error(`API fetch error for ${endpoint}:`, error);
        return {
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error',
        };
    }
}

// Specific fetchers
export async function getProducts(): Promise<ApiResponse<ProductWithPrice[]>> {
    return fetchApi<ProductWithPrice[]>('/products');
}