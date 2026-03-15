# Trion Express — Marketing & Lead Generation

Lead scraper and strategy for **Launch** ($500–$1,500 setup) and **Trion Ultra** ($750–$2,000 + $49–$199/mo) tiers.

## Contents

| File | Description |
|------|--------------|
| `lead_scraper.py` | Python script to fetch real business leads via Google Places API |
| `leads_sample.csv` | Sample CSV format (10 example rows) |
| `requirements-leads.txt` | Dependencies (stdlib only — no extra deps) |

---

## Quick Start

### 1. Google Cloud Setup (one-time)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project → Enable **Places API (New)** and **Geocoding API**
3. Add billing ($200 free credit/month)
4. Create API key under Credentials

### 2. Run the Scraper

```bash
cd marketing
export GOOGLE_PLACES_API_KEY=your_key

# All leads (restaurants, barbers, hair salons, beauty salons)
python lead_scraper.py --output leads.csv

# Only businesses with NO website (hottest Launch leads)
python lead_scraper.py --no-website-only --output leads_no_website.csv

# Exclude sites that already have Calendly/Acuity/Intercom
python lead_scraper.py --exclude-has-booking --output leads_need_ai.csv

# With phone numbers (extra ~$0.017/place)
python lead_scraper.py --no-website-only --with-phone --output leads.csv

# Custom cities
python lead_scraper.py --cities "Austin,Houston,San Antonio" --output leads.csv
```

---

## Output CSV Columns

| Column | Description |
|--------|-------------|
| name | Business name |
| phone | Phone (empty unless `--with-phone`) |
| website | Website URL |
| address | Full address |
| city | City from search |
| place_type | Barbers, Salons, Restaurants, etc. |
| tier_suggestion | Launch (no website) or Trion Ultra (has website) |
| google_maps_url | Link to Google Maps |

---

## Place Types

- `barber_shop`, `hair_salon`, `beauty_salon`, `nail_salon`
- `spa`, `massage_spa`
- `restaurant`, `cafe`
- `plumber`, `electrician`, `roofing_contractor`
- `dentist`, `dental_clinic`

---

## Cost Estimate

- Text Search: ~$0.032/request. 60 requests ≈ $2
- Place Details (--with-phone): ~$0.017/place. 500 places ≈ $8.50

---

## Alternative: Apify

[Apify Google Maps Scraper](https://apify.com/apify/google-maps-scraper) — no-code, pay per run (~$0.25/1000 results).
