# Trion Site Preview — Easy Prompt

Use this prompt when you want an AI to automatically generate a website preview from business info. Copy and adapt as needed.

---

## One-Liner (for quick use)

```
When a business provides: name, type, services (with prices), hours, location, phone, email — automatically generate a full website preview with: (1) hero banner with industry-appropriate hero image and business name, (2) services section with images per service, (3) gallery with 4–5 industry photos, (4) booking form, (5) contact/CTA. Use industry-specific visuals: barber→barbershop images, restaurant→food/dining, contractor→construction, salon→beauty/nails. Match layout to industry. Output as HTML/React or structured JSON for rendering.
```

---

## Full Prompt (for detailed generation)

```
You are building an instant website preview for a small business. The user has provided their business info. Generate a complete, visually rich preview.

**Input (business info):**
- businessName
- type (e.g., barber, nail salon, restaurant, contractor, retail)
- services (list with prices, e.g., "Haircut - $25", "Beard - $15")
- hours (e.g., "Mon–Fri 9am–6pm")
- location
- phone
- email

**Output — generate a website with these sections:**

1. **Hero** — Full-width banner (400px height) with:
   - Industry-appropriate hero image (Unsplash: barbershop, restaurant interior, construction site, salon, etc.)
   - Dark gradient overlay for text readability
   - Business name (large, bold, white)
   - Type + location
   - Hours and phone as pill badges

2. **Services** — Grid of service cards:
   - Each card: image (industry-specific), service name, price
   - Parse "Service - $XX" format from services list
   - Use gallery images that match the industry

3. **Gallery** — 4–5 images in a grid:
   - Industry-specific photos (food for restaurant, haircuts for barber, etc.)
   - Rounded corners, hover zoom

4. **Booking** — Form or CTA:
   - "Book an Appointment"
   - Service dropdown, date, time, name, phone
   - Or prominent "Book now" button

5. **Contact** — Phone, hours, location, or chat widget CTA

**Visual rules:**
- Map business type to image keywords: barber/salon→barbershop, haircut; restaurant/food→restaurant, dining; contractor→construction, tools; nail/beauty→nail salon, manicure; retail→store, products
- Use a consistent accent color (e.g., orange #ea580c)
- Mobile-responsive layout
- Clean, modern, professional

**Format:** Output as React/JSX components or structured JSON with section definitions and image URLs. Use Unsplash URLs with industry-appropriate search terms.
```

---

## Minimal Prompt (for ChatGPT / Claude)

```
Create a website preview from this business data. Include: hero with business name and industry photo, services list with prices and images, photo gallery (4 images), booking section, contact info. Use industry-appropriate stock images (Unsplash) based on business type. Output HTML or React.
```

---

## Industry → Image Mapping (reference)

| Type | Hero | Gallery |
|------|------|---------|
| Barber / Salon | Barbershop interior, chair | Haircuts, beard, styling |
| Nail / Lash | Nail salon, manicure | Nails, beauty, spa |
| Restaurant / Food | Restaurant interior, dining | Food, dishes, kitchen |
| Contractor | Construction, tools | Job sites, before/after |
| Retail | Store interior | Products, shopping |
| Real estate | Luxury home | Properties, listings |
| Healthcare | Dental/medical office | Clean, professional |
| Auto | Garage, cars | Repairs, vehicles |

---

## How Trion Uses This

In the pitch flow, Trion:
1. Extracts `businessName`, `type`, `services`, `hours`, `location`, `phone`, `email` from the chat
2. Maps `type` to an industry profile (from `lib/industries.ts`) for hero + gallery images
3. Parses services into name/price pairs
4. Renders the preview with `getIndustryImages(biz.type)` → `{ hero, gallery, accent }`
5. User clicks "Build My AI Site Now" → preview appears instantly

The key: **industry → visuals mapping** so every business type gets the right look.
