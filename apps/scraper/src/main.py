from playwright.sync_api import sync_playwright
from datetime import datetime
import re
from db import upsert_prices   # ← changed function name
from rich.console import Console
from rich.progress import track

console = Console()

DARAZ_SEARCH = "https://www.daraz.com.np/smartphones/"
STORE_SLUG = "daraz"

def clean_price(text: str) -> float:
    if not text:
        return 0.0
    # Remove all non-digits
    digits_only = re.sub(r'\D', '', text)  # "Rs. 13,499" → "13499"
    try:
        return float(digits_only)
    except ValueError:
        return 0.0

def scrape_daraz_first_page(max_items=5):
    scraped_items = []  # list of (name, url, price, image_url, store_slug)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(
            user_agent="Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                       "(KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36"
        )

        console.print(f"[cyan]→ Loading {DARAZ_SEARCH}[/cyan]")
        page.goto(DARAZ_SEARCH, wait_until="networkidle", timeout=60000)

        page.wait_for_selector('[data-qa-locator="product-item"], div[class*="grid"], div[data-qa-locator*="product"]', timeout=30000)
        items = page.query_selector_all('[data-qa-locator="product-item"]')

        console.print(f"[green]Found {len(items)} product cards[/green]")

        for idx, item in enumerate(items[:max_items], 1):
            try:
                console.print(f"[dim]--- Item {idx} ---[/dim]")

                # Name (your working version)
                name_el = (
                    item.query_selector('div.RfADt a') or
                    item.query_selector('a[title]') or
                    item.query_selector('div[class*="title"] a') or
                    item.query_selector('h2 a, h3 a') or
                    item.query_selector('a')
                )
                
                name = ""
                if name_el:
                    name = name_el.get_attribute("title") or ""
                    if not name:
                        name = name_el.inner_text().strip()
                        if not name and name_el.first_child:
                            name = name_el.first_child.inner_text().strip()
                
                name = name.replace('\n', ' ').strip()
                console.print(f"  Name: '{name}'")

                # Link
                link_el = item.query_selector("a[href]")
                href = link_el.get_attribute("href") if link_el else ""
                product_url = ("https:" + href if href and href.startswith("//") else href) if href else ""
                console.print(f"  URL : {product_url[:80]}...")

                # Price - use the new clean function
                price_els = item.query_selector_all(
                    '[data-qa-locator="product-price"], .ooOxS, span[class*="price"], '
                    'div[class*="price"], .current-price'
                )
                price_text = price_els[0].inner_text().strip() if price_els else ""
                
                if not price_text:
                    # Fallback: regex anywhere in card
                    all_text = item.inner_text()
                    match = re.search(r'(?:Rs\.?|NPR)\s*[\d,]+', all_text, re.I)
                    price_text = match.group(0) if match else ""
                
                price = clean_price(price_text)
                console.print(f"  Price raw: '{price_text}' → {price}")

                # Image
                img_el = item.query_selector("img")
                image_url = (
                    img_el.get_attribute("data-src") or
                    img_el.get_attribute("src") or
                    ""
                )
                console.print(f"  Image: {image_url[:80]}...")

                # Save if valid
                if name and product_url and price > 10:  # >10 to avoid bad parses
                    scraped_items.append((name, product_url, price, image_url, STORE_SLUG))
                    console.print("[green]  → Valid item added[/green]")
                else:
                    console.print("[yellow]  → Skipped[/yellow]")

            except Exception as e:
                console.print(f"[red]  Error on item {idx}: {e}[/red]")
                continue       

    if scraped_items:
        console.print(f"[bold green]Saving {len(scraped_items)} items...[/bold green]")
        upsert_prices(scraped_items)
        console.print("[bold green]Done![/bold green]")
    else:
        console.print("[red]No valid products scraped.[/red]")

if __name__ == "__main__":
    scrape_daraz_first_page(max_items=5)