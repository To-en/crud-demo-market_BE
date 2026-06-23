"""
ingest_off_to_pg.py
-------------------
Pull ~1,000 curated raw ingredients & seasonings from Open Food Facts API
→ clean → bulk insert into crud_market.ingredient (PostgreSQL)

Requirements:
    pip install requests psycopg2-binary python-dotenv

.env file:
    DB_HOST=localhost
    DB_PORT=5432
    DB_NAME=your_db
    DB_USER=your_user
    DB_PASSWORD=your_password
"""

import os
import time
import random
import requests
import psycopg2
import psycopg2.extras
from dotenv import load_dotenv

load_dotenv()

# ─────────────────────────────────────────────
# CONFIG
# ─────────────────────────────────────────────

DB_CONFIG = {
    "host":     os.getenv("DB_HOST", "localhost"),
    "port":     int(os.getenv("DB_PORT", 5432)),
    "dbname":   os.getenv("DB_NAME"),
    "user":     os.getenv("DB_USER"),
    "password": os.getenv("DB_PASSWORD"),
}

OFF_SEARCH_URL = "https://world.openfoodfacts.org/cgi/search.pl"
PAGE_SIZE = 50       # OFF max per page
TARGET_ROWS = 1000
SLEEP_BETWEEN = 1.2  # seconds — be polite to OFF servers

# ─────────────────────────────────────────────
# CATEGORIES TO PULL
# Tuned for "cook a unique menu every day for a month"
# Mix of: proteins, veg, grains, dairy, sauces, spices, oils
# ─────────────────────────────────────────────

CATEGORIES = [
    # Proteins
    ("en:chicken",           "Meat & Seafood",  "kg"),
    ("en:beef",              "Meat & Seafood",  "kg"),
    ("en:pork",              "Meat & Seafood",  "kg"),
    ("en:fish",              "Meat & Seafood",  "kg"),
    ("en:shrimps",           "Meat & Seafood",  "kg"),
    ("en:eggs",              "Dairy & Eggs",    "pcs"),
    ("en:tofu",              "Plant Protein",   "g"),

    # Vegetables
    ("en:tomatoes",          "Vegetables",      "kg"),
    ("en:onions",            "Vegetables",      "kg"),
    ("en:garlic",            "Vegetables",      "kg"),
    ("en:carrots",           "Vegetables",      "kg"),
    ("en:potatoes",          "Vegetables",      "kg"),
    ("en:spinach",           "Vegetables",      "kg"),
    ("en:broccoli",          "Vegetables",      "kg"),
    ("en:bell-peppers",      "Vegetables",      "kg"),
    ("en:mushrooms",         "Vegetables",      "kg"),
    ("en:cucumbers",         "Vegetables",      "kg"),
    ("en:cabbage",           "Vegetables",      "kg"),
    ("en:eggplants",         "Vegetables",      "kg"),
    ("en:zucchinis",         "Vegetables",      "kg"),

    # Grains & Carbs
    ("en:rice",              "Grains",          "kg"),
    ("en:pasta",             "Grains",          "kg"),
    ("en:noodles",           "Grains",          "kg"),
    ("en:bread",             "Bakery",          "pcs"),
    ("en:flour",             "Grains",          "kg"),

    # Dairy
    ("en:milk",              "Dairy & Eggs",    "ml"),
    ("en:butter",            "Dairy & Eggs",    "g"),
    ("en:cheese",            "Dairy & Eggs",    "g"),
    ("en:cream",             "Dairy & Eggs",    "ml"),
    ("en:yogurts",           "Dairy & Eggs",    "g"),

    # Sauces & Condiments
    ("en:soy-sauces",        "Sauces",          "ml"),
    ("en:fish-sauces",       "Sauces",          "ml"),
    ("en:oyster-sauces",     "Sauces",          "ml"),
    ("en:tomato-sauces",     "Sauces",          "ml"),
    ("en:hot-sauces",        "Sauces",          "ml"),
    ("en:vinegars",          "Sauces",          "ml"),
    ("en:ketchups",          "Sauces",          "ml"),
    ("en:mayonnaises",       "Sauces",          "ml"),

    # Oils & Fats
    ("en:olive-oils",        "Oils",            "ml"),
    ("en:vegetable-oils",    "Oils",            "ml"),
    ("en:coconut-oil",       "Oils",            "ml"),
    ("en:sesame-oils",       "Oils",            "ml"),

    # Spices & Seasonings
    ("en:salt",              "Spices",          "g"),
    ("en:pepper",            "Spices",          "g"),
    ("en:cumin",             "Spices",          "g"),
    ("en:turmeric",          "Spices",          "g"),
    ("en:paprika",           "Spices",          "g"),
    ("en:cinnamon",          "Spices",          "g"),
    ("en:chili-peppers",     "Spices",          "g"),
    ("en:ginger",            "Spices",          "g"),
    ("en:lemongrass",        "Spices",          "g"),
    ("en:basil",             "Spices",          "g"),
    ("en:oregano",           "Spices",          "g"),
    ("en:thyme",             "Spices",          "g"),
    ("en:coriander",         "Spices",          "g"),
    ("en:curry-powder",      "Spices",          "g"),
    ("en:sugar",             "Spices",          "g"),

    # Broths & Stocks
    ("en:chicken-broths",    "Broths",          "ml"),
    ("en:beef-broths",       "Broths",          "ml"),
    ("en:vegetable-broths",  "Broths",          "ml"),

    # Legumes
    ("en:lentils",           "Legumes",         "g"),
    ("en:chickpeas",         "Legumes",         "g"),
    ("en:kidney-beans",      "Legumes",         "g"),
]


# ─────────────────────────────────────────────
# FETCH FROM OFF API
# ─────────────────────────────────────────────

def fetch_category(category_tag: str, page: int = 1) -> list[dict]:
    params = {
        "action":           "process",
        "tagtype_0":        "categories",
        "tag_contains_0":   "contains",
        "tag_0":            category_tag,
        "fields":           "code,product_name,generic_name_en,brands,quantity,categories_tags,allergens_tags,labels_tags,image_url",
        "page_size":        PAGE_SIZE,
        "page":             page,
        "json":             1,
        "lc":               "en",
        "lang":             "en",
    }
    try:
        r = requests.get(OFF_SEARCH_URL, params=params, timeout=15)
        r.raise_for_status()
        data = r.json()
        return data.get("products", [])
    except Exception as e:
        print(f"  ⚠️  Failed to fetch {category_tag} page {page}: {e}")
        return []


# ─────────────────────────────────────────────
# CLEAN + NORMALIZE
# ─────────────────────────────────────────────

def parse_tags(tags: list) -> list[str]:
    """Strip 'en:' prefix from OFF tag arrays."""
    return [t.replace("en:", "").replace("-", " ").title() for t in (tags or [])]


def clean_product(row: dict, category: str, default_unit: str) -> dict | None:
    name = (
        row.get("product_name") or
        row.get("generic_name_en") or
        ""
    ).strip()

    if not name or len(name) < 2:
        return None

    return {
        "name":             name[:255],
        "unit":             default_unit,
        "stock":            random.randint(10, 200),   # placeholder stock
        "category":         category,
        "unit_price":       round(random.uniform(10, 500), 2),  # placeholder price (THB)
        "image_url":        (row.get("image_url") or "")[:255] or None,
        "delete_at":        None,
        # Extended OFF fields
        "barcode":          row.get("code") or None,
        "brand":            (row.get("brands") or "")[:255] or None,
        "quantity":         (row.get("quantity") or "")[:100] or None,
        "allergens":        parse_tags(row.get("allergens_tags")),
        "labels":           parse_tags(row.get("labels_tags")),
        "country_origin":   None,
        "off_id":           row.get("code") or None,
    }


# ─────────────────────────────────────────────
# UPSERT TO POSTGRES
# ─────────────────────────────────────────────

UPSERT_SQL = """
INSERT INTO crud_market.ingredient (
    name, unit, stock, category, unit_price, image_url, delete_at,
    barcode, brand, quantity, allergens, labels, country_origin, off_id
)
VALUES (
    %(name)s, %(unit)s, %(stock)s, %(category)s, %(unit_price)s,
    %(image_url)s, %(delete_at)s,
    %(barcode)s, %(brand)s, %(quantity)s,
    %(allergens)s, %(labels)s, %(country_origin)s, %(off_id)s
)
ON CONFLICT (barcode) DO NOTHING;
"""


def migrate_schema(cur):
    """Add extended columns if they don't exist yet — safe to re-run."""
    alter_statements = [
        "ALTER TABLE crud_market.ingredient ADD COLUMN IF NOT EXISTS barcode       TEXT UNIQUE",
        "ALTER TABLE crud_market.ingredient ADD COLUMN IF NOT EXISTS brand         VARCHAR(255)",
        "ALTER TABLE crud_market.ingredient ADD COLUMN IF NOT EXISTS quantity      VARCHAR(100)",
        "ALTER TABLE crud_market.ingredient ADD COLUMN IF NOT EXISTS allergens     TEXT[]",
        "ALTER TABLE crud_market.ingredient ADD COLUMN IF NOT EXISTS labels        TEXT[]",
        "ALTER TABLE crud_market.ingredient ADD COLUMN IF NOT EXISTS country_origin VARCHAR(100)",
        "ALTER TABLE crud_market.ingredient ADD COLUMN IF NOT EXISTS off_id        TEXT",
    ]
    for stmt in alter_statements:
        cur.execute(stmt)
    print("✅ Schema migration done (new columns added if missing)")


def bulk_insert(conn, rows: list[dict]):
    with conn.cursor() as cur:
        psycopg2.extras.execute_batch(cur, UPSERT_SQL, rows, page_size=100)
    conn.commit()


# ─────────────────────────────────────────────
# MAIN
# ─────────────────────────────────────────────

def main():
    conn = psycopg2.connect(**DB_CONFIG)
    print(f"🔌 Connected to PostgreSQL: {DB_CONFIG['dbname']}")

    with conn.cursor() as cur:
        migrate_schema(cur)
    conn.commit()

    all_rows: list[dict] = []
    seen_names: set[str] = set()

    for (cat_tag, category, unit) in CATEGORIES:
        if len(all_rows) >= TARGET_ROWS:
            break

        print(f"\n📦 Fetching: {cat_tag} → [{category}]")
        products = fetch_category(cat_tag, page=1)

        for p in products:
            if len(all_rows) >= TARGET_ROWS:
                break

            cleaned = clean_product(p, category, unit)
            if not cleaned:
                continue

            # Deduplicate by name
            key = cleaned["name"].lower()
            if key in seen_names:
                continue
            seen_names.add(key)

            all_rows.append(cleaned)

        print(f"  → collected so far: {len(all_rows)}")
        time.sleep(SLEEP_BETWEEN)

    print(f"\n🧹 Total cleaned rows ready: {len(all_rows)}")
    print("⬆️  Inserting to PostgreSQL...")

    bulk_insert(conn, all_rows)
    conn.close()

    print(f"✅ Done! {len(all_rows)} ingredients pushed to crud_market.ingredient")


if __name__ == "__main__":
    main()