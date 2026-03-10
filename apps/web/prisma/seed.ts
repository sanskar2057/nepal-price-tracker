import * as dotenv from 'dotenv';
dotenv.config({ path: '.env', override: true });  

// apps/web/prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error('DATABASE_URL is not set in .env');
}

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  // Upsert Daraz
  await prisma.store.upsert({
    where: { slug: 'daraz' },
    update: {},
    create: {
      slug: 'daraz',
      name: 'Daraz Nepal',
      baseUrl: 'https://www.daraz.com.np',
      logoUrl: 'https://static.daraz.com.np/static/images/logo/daraz-logo.png',
    },
  });

  // Upsert Hamrobazar
  await prisma.store.upsert({
    where: { slug: 'hamrobazar' },
    update: {},
    create: {
      slug: 'hamrobazar',
      name: 'Hamrobazar',
      baseUrl: 'https://hamrobazar.com',
      logoUrl: null,
    },
  });

  console.log('Seed completed: Daraz and Hamrobazar stores added.');
}

main()
  .catch((e) => {
    console.error('Seed error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end(); // Clean up pool
  });