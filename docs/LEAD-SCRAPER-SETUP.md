# Lead Scraper Setup — Real Business Data for Launch & Trion Ultra

Get a CSV of real leads (name, phone, website, address) for your target industries.

## 1. Google Cloud Setup (one-time)

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a project or select existing
3. **Enable APIs**: Places API (New), Geocoding API
4. **Billing**: Add a payment method (you get $200 free credit/month; typical run costs $2–10)
5. **Create API key**: APIs & Services → Credentials → Create Credentials → API Key
6. Restrict the key to Places API and Geocoding API (recommended)

## 2. Run the Scraper

```bash
# Set your API key
export GOOGLE_PLACES_API_KEY=your_key_here

# Default: Austin, Houston, Dallas — restaurants, barbers, hair salons, beauty salons
python scripts/lead_scraper.py --output leads.csv

# Only businesses with NO website (hottest Launch leads)
python scripts/lead_scraper.py --no-website-only --output leads_no_website.csv

# Exclude sites that already have Calendly/Acuity/Intercom (have booking/chat)
python scripts/lead_scraper.py --exclude-has-booking --output leads_need_ai.csv

# Both: no website OR has website but no booking/chat
python scripts/lead_scraper.py --no-website-only --output leads.csv
python scripts/lead_scraper.py --exclude-has-booking --output leads_need_ai.csv
# Then combine the two CSVs for full list

# Custom cities
python scripts/lead_scraper.py --cities "Austin,Houston,San Antonio" --output leads.csv

# Specific business types only
python scripts/lead_scraper.py --types "barber_shop,beauty_salon,spa" --output leads.csv

# Include phone numbers (extra ~$0.017 per place — uses Place Details)
python scripts/lead_scraper.py --with-phone --output leads.csv

# Limit results per city+type (default 20 per query)
python scripts/lead_scraper.py --limit 20 --output leads.csv
```

## 3. Output CSV Columns

| Column | Description |
|--------|-------------|
| name | Business name |
| phone | Phone number (empty unless `--with-phone`) |
| website | Website URL |
| address | Full address |
| city | City from your search |
| place_type | Business type (Barbers, Salons, etc.) |
| tier_suggestion | Launch (no website) or Trion Ultra (has website) |
| google_maps_url | Link to Google Maps listing |

## 4. Place Types You Can Use

- `barber_shop` — Barbers
- `beauty_salon`, `hair_salon` — Salons
- `nail_salon` — Nail salons
- `spa`, `massage_spa` — Spas
- `plumber`, `electrician`, `roofing_contractor` — Home services
- `restaurant`, `cafe` — Food & drink
- `dentist`, `dental_clinic` — Dental

## 5. Cost Estimate

- **Text Search**: ~$0.032 per request. 10 cities × 6 types = 60 requests ≈ $2
- **Place Details** (with `--with-phone`): ~$0.017 per place. 500 places ≈ $8.50
- Free tier: $200/month credit

## 6. If You Don't Have Phone

Without `--with-phone`, the phone column is usually empty. You can:

1. **Use the Google Maps link** — Open each row's `google_maps_url` and copy the phone
2. **Use Hunter.io or Apollo** — Find email from website domain
3. **Run with `--with-phone`** — Pay for Place Details to get phones in the CSV

## 7. Alternative: Apify Google Maps Scraper

If you prefer a no-code option:

1. Go to [Apify Google Maps Scraper](https://apify.com/apify/google-maps-scraper)
2. Enter search: "barbershop Austin TX"
3. Run and export CSV
4. Costs ~$0.25 per 1000 results (pay per run)
