# 🇳🇵 Nepal Price Tracker

A **price comparison & tracking platform for Nepali online marketplaces**.

The goal of this project is to help users **track product prices across multiple e-commerce platforms in Nepal** and see **price history, comparisons, and best deals**.

Currently tracking **smartphones from Daraz Nepal**.

---

## 🚀 Planned Marketplaces

- Daraz Nepal ✅ (Current)
- Hamrobazar
- Sastodeal
- Gyapu
- OkDam
- More Nepali stores in the future

---

# 🏗 Tech Stack

### Frontend
- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**

Location:
```
apps/web
```

### Scraper / Backend
- **Python**
- **Playwright**
- **psycopg2**

Location:
```
apps/scraper
```

### Database
- **PostgreSQL**
- Hosted on **Neon Serverless**

### ORM
- **Prisma** (used by frontend)
- **Raw SQL** (used by scraper)

---

# 📊 Current Features

- Scrapes **Daraz Nepal smartphone listings**
- Extracts:
  - Product name
  - Price
  - Image
  - Product URL
- Cleans price values (`Rs.` → numeric)
- Saves data into **PostgreSQL**
- Uses **upsert logic** for products
- Stores **price history**
- Basic **name-based deduplication**

---

# 📂 Project Structure

```
nepal-price-tracker/
│
├── apps/
│   ├── web/              # Next.js frontend
│   │
│   └── scraper/          # Python price scraper
│       ├── src/
│       │   ├── db.py
│       │   └── main.py
│       │
│       ├── .venv/
│       ├── .env
│       └── requirements.txt
│
├── prisma/
│   └── schema.prisma
│
├── pnpm-workspace.yaml
└── README.md
```

---

# ⚙️ Development Setup

## 1️⃣ Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/nepal-price-tracker.git
cd nepal-price-tracker
```

---

## 2️⃣ Install frontend dependencies

```bash
pnpm install
```

---

## 3️⃣ Setup environment variables

Create `.env` files in:

```
apps/web/.env
apps/scraper/.env
```

Add your **Neon PostgreSQL connection string**:

```
DATABASE_URL=postgresql://USER:PASSWORD@HOST/DBNAME
```

---

## 4️⃣ Run Prisma schema

```bash
cd apps/web
npx prisma db push
```

Optional: open Prisma Studio

```bash
npx prisma studio
```

---

## 5️⃣ Run the scraper

Navigate to the scraper directory:

```bash
cd apps/scraper
```

Activate the virtual environment:

```bash
source .venv/bin/activate
```

Run the scraper:

```bash
python src/main.py
```

---

# 📈 Future Improvements

- Track **multiple marketplaces**
- Product **price history charts**
- **Price drop alerts**
- Product **search & filtering**
- **Product matching across stores**
- Automated **daily scraping jobs**
- Browser extension for quick comparisons

---

# 🎯 Purpose of This Project

- Learn **web scraping with Playwright**
- Practice **full-stack architecture**
- Build a **real-world product useful for Nepali users**
- Potential to grow into a **startup / SaaS**

---

## Important Notice

This project is a **personal learning/portfolio demonstration only**.
- Scraping is done manually and infrequently (5–12 items per run).
- No personal data is collected.
- No commercial use, monetization, or redistribution of scraped data.
- Respect website terms — do not deploy this scraper publicly or run it at high frequency.r
