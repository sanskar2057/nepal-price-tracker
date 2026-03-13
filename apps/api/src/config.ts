import dotenv from 'dotenv';

dotenv.config();

if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is required in .env');
}

export const config = {
    databaseUrl: process.env.DATABASE_URL,
    port: Number(process.env.PORT) || 4000,
    nodeEnv: process.env.NODE_ENV || 'development'
}