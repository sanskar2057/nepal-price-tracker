import os
from dotenv import load_dotenv
import psycopg2
from psycopg2.extras import execute_values
from psycopg2 import pool
from typing import List, Tuple
from datetime import datetime

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")
if not DATABASE_URL:
    raise ValueError("DATABASE_URL not found in .env")

pool = psycopg2.pool.ThreadedConnectionPool(
    minconn=1,
    maxconn=10,
    dsn=DATABASE_URL
)

def get_connection():
    return pool.getconn()

def put_connection(conn):
    pool.putconn(conn)

def upsert_prices(items: List[Tuple[str, str, float, str, str]]):
    conn = get_connection()
    try:
        with conn.cursor() as cur:
            now_iso = datetime.utcnow().isoformat()
            inserted = 0

            for name, url, price, image_url, store_slug in items:
                # Step 1: Try to find existing Product by approximate name + store
                # (loose for MVP — improve with externalId later)
                cur.execute(
                    """
                    SELECT id FROM "Product"
                    WHERE name ILIKE %s
                    LIMIT 1
                    """,
                    (f"%{name[:50]}%",)  # partial match
                )
                product_row = cur.fetchone()

                if product_row:
                    product_id = product_row[0]
                else:
                    # Create new Product
                    cur.execute(
                        """
                        INSERT INTO "Product" (name, "mainImageUrl", slug, "categorySlug","updatedAt")
                        VALUES (%s, %s, %s, %s, %s::timestamptz)
                        RETURNING id
                        """,
                        (
                            name,
                            image_url or None,
                            name.lower().replace(" ", "-")[:100],  # simple slug
                            "smartphones",
                            datetime.utcnow().isoformat()
                        )
                    )
                    product_id = cur.fetchone()[0]

                # Step 2: Find store id
                cur.execute(
                    'SELECT id FROM "Store" WHERE slug = %s',
                    (store_slug,)
                )
                store_row = cur.fetchone()
                if not store_row:
                    print(f"Store {store_slug} not found — skipping")
                    continue
                store_id = store_row[0]

                # Step 3: Upsert Price
                cur.execute(
                    """
                    INSERT INTO "Price" (
                        "productId", "storeId", "priceNpr", "url", "scrapedAt", "stockStatus"
                    )
                    VALUES (%s, %s, %s, %s, %s::timestamptz, %s)
                    ON CONFLICT ("productId", "storeId") DO UPDATE SET
                        "priceNpr" = EXCLUDED."priceNpr",
                        "url" = EXCLUDED."url",
                        "scrapedAt" = EXCLUDED."scrapedAt"
                    """,
                    (product_id, store_id, price, url, now_iso, "available")
                )

                inserted += 1

            conn.commit()
            print(f"[green]Successfully saved/updated {inserted} prices[/green]")

    except Exception as e:
        conn.rollback()
        raise e
    finally:
        put_connection(conn)