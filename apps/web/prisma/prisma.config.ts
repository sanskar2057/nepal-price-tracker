// prisma.config.ts
// Prisma 7+ automatically loads .env for env() calls in this file
import "dotenv/config";
export default {
    schema: "schema.prisma",

    datasource: {
        url: process.env.DATABASE_URL,  // ← use process.env directly (dotenv is auto-loaded by Prisma CLI)
    },

    migrations: {
        path: "migrations",
    },

    // Optional: add when you create a seed script
    // seed: "tsx seed.ts",
};