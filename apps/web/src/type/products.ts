export type LatestPrice = {
    priceNpr: number;
    url: string;
    scrapedAt: string;
    stockStatus: string | null;
};

export type ProductWithPrice = {
    id: number;
    name: string;
    slug: string;
    mainImageUrl: string | null;
    categorySlug: string;
    createdAt: string;
    updatedAt: string;
    latestPrice: LatestPrice | null;
    // add brand, description, specs if you want to show them
};