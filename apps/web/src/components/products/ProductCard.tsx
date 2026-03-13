// Your file: src/components/products/ProductCard.tsx

import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ProductWithPrice } from "@/type/products";
import { formatRelativeTime } from "@/utils/dateUtils";


interface ProductCardProps {
    product: ProductWithPrice;
}

export function ProductCard({ product }: ProductCardProps) {
    // You write:
    // 1. Format price with toLocaleString() or custom function
    // 2. Calculate relative time for scrapedAt (optional – use date-fns or simple math)
    // 3. Handle missing image with placeholder
    // 4. Truncate long titles

    return (
        <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 border border-border/50">
            {/* Image – aspect ratio, full width */}
            <div className="relative aspect-square w-full bg-muted">
                <Image
                    src={product.mainImageUrl || "/placeholder.svg?height=400&width=400&text=No+Image"}
                    alt={product.name}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                />
            </div>

            <CardHeader className="p-4 pb-2">
                {/* Title – truncate 2 lines */}
                <h3 className="font-semibold line-clamp-2 text-lg leading-tight">
                    {product.name}
                </h3>
            </CardHeader>

            <CardContent className="p-4 pt-0">
                {/* Price – big & bold */}
                <div className="text-2xl font-bold text-primary">
                    {
                        product.latestPrice?.priceNpr ? `Rs. ${product.latestPrice?.priceNpr?.toLocaleString()}` : `Price Unavailable`
                    }
                </div>

                {/* Optional: original price if you have it */}
                {/* {product.latestPrice?.originalPriceNpr && (
          <span className="text-sm text-muted-foreground line-through">
            Rs. {product.latestPrice.originalPriceNpr.toLocaleString()}
          </span>
        )} */}

                {/* Scraped time – small gray text */}
                <p className="text-xs text-muted-foreground mt-2">
                    {`Scrapped at: ${formatRelativeTime(product.latestPrice?.scrapedAt || 'Unknown')}`}
                </p>
            </CardContent>

            <CardFooter className="p-4 pt-0">
                <Button variant="outline" className="w-full" asChild>
                    <a
                        href={product.latestPrice?.url || "#"}
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        View on Daraz
                    </a>
                </Button>
            </CardFooter>
        </Card>
    );
}