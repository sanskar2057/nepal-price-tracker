// apps/web/src/app/products/page.tsx

import { getProducts } from '@/lib/api'; // adjust path if different
import { ProductCard } from '@/components/products/ProductCard';
import { ProductWithPrice } from '@/type/products';

export default async function ProductsPage() {
    let products: ProductWithPrice[] = [];
    let error: string | null = null;

    try {
        const response = await getProducts();

        if (response.success && response.data) {
            products = response.data;
        } else {
            error = response.error || 'Failed to load products';
        }
    } catch (err) {
        error = 'Network error while fetching products';
        console.error(err);
    }

    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-3xl md:text-4xl font-bold mb-8 text-center">
                Latest Smartphones from Daraz
            </h1>

            {error ? (
                <div className="text-center py-12 text-red-600">
                    {error}
                </div>
            ) : products.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                    No products found yet. Run the scraper!
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
}