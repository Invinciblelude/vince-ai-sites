#!/usr/bin/env python3
"""
Trion Express Lead Scraper — Get real business leads for Launch & Trion Ultra tiers.
Uses Google Places API (New) to fetch: name, phone, website, address.

Setup:
  1. Get Google Cloud API key: https://console.cloud.google.com/
  2. Enable: Places API (New), Geocoding API
  3. Set billing (free $200/month credit)
  4. export GOOGLE_PLACES_API_KEY=your_key

Run (from marketing/ folder):
  python lead_scraper.py --cities "Austin,Houston,Dallas" --output leads.csv
  python lead_scraper.py --no-website-only --with-phone --output leads.csv
"""

import argparse
import csv
import json
import os
import re
import time
from urllib.request import Request, urlopen
from urllib.error import HTTPError, URLError

# Patterns that suggest a site already has booking or AI chat (exclude from leads)
HAS_BOOKING_OR_CHAT = re.compile(
    r"calendly|acuityscheduling|setmore|squareup\.com/appointments|"
    r"intercom|drift|tawk\.to|zendesk|hubspot.*chat|crisp\.chat|"
    r"livechat|tidio|olark|purechat",
    re.I,
)

# Business types for Launch ($500-1.5K) and Trion Ultra ($750-2K + $49-199/mo)
# Maps our labels to Google Places API place types
PLACE_TYPES = {
    "barber_shop": "Barbers",
    "beauty_salon": "Salons",
    "hair_salon": "Hair Salons",
    "nail_salon": "Nail Salons",
    "spa": "Spas",
    "massage_spa": "Massage",
    "plumber": "Plumbers",
    "electrician": "Electricians",
    "roofing_contractor": "Roofers",
    "restaurant": "Restaurants",
    "cafe": "Cafes",
    "dentist": "Dentists",
    "dental_clinic": "Dental Clinics",
}

# Pro-tier fields. Phone requires Place Details (use --with-phone).
FIELD_MASK = "places.id,places.displayName,places.formattedAddress,places.websiteUri,places.googleMapsUri,places.primaryType"


def search_places(api_key: str, text_query: str, limit: int = 20) -> list[dict]:
    """Text Search (New) - search for businesses by query."""
    url = "https://places.googleapis.com/v1/places:searchText"
    payload = json.dumps({
        "textQuery": text_query,
        "maxResultCount": min(limit, 20),
    }).encode("utf-8")

    req = Request(
        url,
        data=payload,
        headers={
            "Content-Type": "application/json",
            "X-Goog-Api-Key": api_key,
            "X-Goog-FieldMask": FIELD_MASK,
        },
        method="POST",
    )

    try:
        with urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode())
    except HTTPError as e:
        body = e.read().decode() if e.fp else ""
        raise RuntimeError(f"Places API error {e.code}: {body}")
    except URLError as e:
        raise RuntimeError(f"Request failed: {e.reason}")

    places = data.get("places") or []
    results = []
    for p in places:
        name = (p.get("displayName") or {}).get("text", "")
        addr = p.get("formattedAddress", "")
        website = p.get("websiteUri", "")
        maps_url = p.get("googleMapsUri", "")
        phone = ""  # Use --with-phone to fetch via Place Details
        primary_type = p.get("primaryType", "")
        results.append({
            "name": name,
            "phone": phone or "",
            "website": website or "",
            "address": addr or "",
            "google_maps_url": maps_url or "",
            "place_type": primary_type,
            "place_id": p.get("id", ""),
        })
    return results


def get_place_details(api_key: str, place_id: str) -> dict:
    """Place Details (New) - get phone for a place. Costs ~$0.017 per call."""
    url = f"https://places.googleapis.com/v1/places/{place_id}"
    req = Request(
        url,
        headers={
            "X-Goog-Api-Key": api_key,
            "X-Goog-FieldMask": "nationalPhoneNumber,internationalPhoneNumber",
        },
        method="GET",
    )
    try:
        with urlopen(req, timeout=10) as resp:
            data = json.loads(resp.read().decode())
        return {
            "phone": data.get("nationalPhoneNumber") or data.get("internationalPhoneNumber") or "",
        }
    except Exception:
        return {"phone": ""}


def suggest_tier(place: dict) -> str:
    """Suggest Launch vs Trion Ultra based on website presence."""
    has_website = bool(place.get("website", "").strip())
    return "Trion Ultra" if has_website else "Launch"


def website_has_booking_or_chat(url: str) -> bool:
    """Check if website has common booking/chat widgets (so we can exclude)."""
    if not url or not url.strip():
        return False
    url = url.strip()
    if not url.startswith("http"):
        url = "https://" + url
    try:
        req = Request(url, headers={"User-Agent": "Mozilla/5.0 (compatible; TrionLeadCheck/1.0)"})
        with urlopen(req, timeout=8) as resp:
            html = resp.read().decode("utf-8", errors="ignore")
        return bool(HAS_BOOKING_OR_CHAT.search(html))
    except Exception:
        return False  # Can't fetch = assume no booking (include as lead)


def main():
    parser = argparse.ArgumentParser(description="Scrape business leads for Trion Express")
    parser.add_argument("--cities", default="Austin,Houston,Dallas", help="Comma-separated cities (e.g. Austin,Houston)")
    parser.add_argument("--types", default="restaurant,barber_shop,hair_salon,beauty_salon",
                        help="Comma-separated place types (restaurant, barber_shop, hair_salon, beauty_salon, spa, nail_salon, plumber)")
    parser.add_argument("--output", default="leads.csv", help="Output CSV path")
    parser.add_argument("--limit", type=int, default=50, help="Max places per city+type (approx)")
    parser.add_argument("--no-website-only", action="store_true",
                        help="Only include businesses with NO website (hottest Launch leads)")
    parser.add_argument("--exclude-has-booking", action="store_true",
                        help="Exclude businesses whose website has Calendly/Acuity/Intercom/etc (already have booking/chat)")
    parser.add_argument("--with-phone", action="store_true",
                        help="Fetch phone via Place Details (extra API cost ~$0.017/place)")
    parser.add_argument("--delay", type=float, default=0.2, help="Seconds between API calls")
    args = parser.parse_args()

    api_key = os.environ.get("GOOGLE_PLACES_API_KEY")
    if not api_key:
        print("Error: Set GOOGLE_PLACES_API_KEY in your environment")
        print("  export GOOGLE_PLACES_API_KEY=your_key")
        return 1

    cities = [c.strip() for c in args.cities.split(",") if c.strip()]
    types = [t.strip() for t in args.types.split(",") if t.strip()]

    seen_ids: set[str] = set()
    rows: list[dict] = []

    for city in cities:
        for type_key in types:
            label = PLACE_TYPES.get(type_key, type_key.replace("_", " ").title())
            query = f"{label} in {city}"
            print(f"Searching: {query}...")
            try:
                places = search_places(api_key, query, limit=min(args.limit, 20))
            except Exception as e:
                print(f"  Error: {e}")
                continue

            for p in places:
                pid = p.get("place_id", "")
                if pid and pid in seen_ids:
                    continue
                if pid:
                    seen_ids.add(pid)

                if args.with_phone and not p.get("phone"):
                    time.sleep(args.delay)
                    details = get_place_details(api_key, pid)
                    p["phone"] = details.get("phone", "")

                # Filter: only no-website leads if requested
                has_website = bool((p.get("website") or "").strip())
                if args.no_website_only and has_website:
                    continue

                # Filter: exclude sites that already have booking/chat
                if args.exclude_has_booking and has_website:
                    print(f"  Checking {p['name']} website...", end=" ")
                    if website_has_booking_or_chat(p["website"]):
                        print("has booking/chat, skip")
                        continue
                    print("no booking/chat, include")
                    time.sleep(args.delay)

                tier = suggest_tier(p)
                rows.append({
                    "name": p["name"],
                    "phone": p["phone"],
                    "website": p["website"],
                    "address": p["address"],
                    "city": city,
                    "place_type": label,
                    "tier_suggestion": tier,
                    "google_maps_url": p["google_maps_url"],
                })

            time.sleep(args.delay)

    # Write CSV
    if not rows:
        print("No leads found.")
        return 0

    fieldnames = ["name", "phone", "website", "address", "city", "place_type", "tier_suggestion", "google_maps_url"]
    out_path = args.output
    with open(out_path, "w", newline="", encoding="utf-8") as f:
        w = csv.DictWriter(f, fieldnames=fieldnames)
        w.writeheader()
        w.writerows(rows)

    print(f"\nSaved {len(rows)} leads to {out_path}")
    print("Columns: name, phone, website, address, city, place_type, tier_suggestion, google_maps_url")
    return 0


if __name__ == "__main__":
    exit(main())
