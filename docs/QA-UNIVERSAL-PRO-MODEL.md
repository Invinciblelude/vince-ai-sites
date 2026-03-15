# QA Checklist — Universal Pro Model (Job/Role/Business → TRION Offer)

Use this checklist to confirm Trion correctly switches to STRATEGIST mode and outputs the full structure for any industry.

---

## Pre-flight

- [ ] **Pitch page** (`/pitch`) loads and chat works
- [ ] **VinceAssistant widget** (Talk to Trion) opens and chat works
- [ ] **Services section** (`/home#services`) shows 5 Pro cards (Universal Role Analysis, TRION Service Model, Packages & Outreach, Industry Agnostic, 24/7 Execution)

---

## Test 1: Blue-collar role (e.g., HVAC dispatcher)

**Input:** Paste this into the pitch chat or widget:

```
We're hiring a Dispatcher / Customer Service Rep for our HVAC company.
Responsibilities: Answer incoming calls, schedule service calls, coordinate with technicians, update customers on arrival times, handle reschedules and cancellations, log all calls in our system, follow up on completed jobs for reviews.
Requirements: Reliable, good phone manner, basic computer skills. Full-time, Mon-Fri 8am-5pm.
```

**Expected output (Trion in STRATEGIST mode):**

- [ ] **Core needs** — 5–10 bullets grouped by theme (operations, admin, communication)
- [ ] **Hidden goals / pain points** — e.g., missed calls, no-shows, chaos in scheduling
- [ ] **TRION service model** — How TRION delivers as a service (strategy, systems, coordination, reporting)
- [ ] **2–3 packages** — e.g., Fractional Dispatcher retainer, Done-with-you systems build, One-time setup + ops support
- [ ] **Outreach script** — Short positioning + email/DM the founder can send
- [ ] **Industry adaptation** — HVAC-specific tools, regulations, or KPIs

**Red flags:** Trion asks "What's your business name?" or tries to build a site instead of analyzing the role.

---

## Test 2: SaaS / tech role (e.g., Customer Success Manager)

**Input:** Paste this into the pitch chat or widget:

```
Customer Success Manager — B2B SaaS
Own the post-sale relationship. Onboard new customers, run QBRs, identify expansion opportunities, track health scores, escalate churn risks. Work with Sales and Product. Use HubSpot, Intercom, our product. Report to VP Customer Success.
```

**Expected output (Trion in STRATEGIST mode):**

- [ ] **Core needs** — Onboarding, QBRs, expansion, health tracking, churn prevention, cross-team coordination
- [ ] **Hidden goals** — Reduce churn, increase NRR, scale without hiring
- [ ] **TRION service model** — Strategy, systems (HubSpot/Intercom), coordination, reporting
- [ ] **Packages** — Fractional CSM, done-with-you playbooks, one-time health-score setup
- [ ] **Outreach** — Positioning + message for SaaS founders
- [ ] **Industry adaptation** — B2B SaaS tools, KPIs (NRR, health score, expansion)

**Red flags:** Trion defaults to barber/salon/restaurant framing or ignores SaaS context.

---

## Test 3: Medical / regulated (e.g., Medical Office Coordinator)

**Input:** Paste this into the pitch chat or widget:

```
Medical Office Coordinator — busy family practice
Schedule appointments, verify insurance, collect copays, manage patient intake forms, coordinate with providers, handle referrals, ensure HIPAA compliance. Experience with EMR (Epic or similar) preferred.
```

**Expected output (Trion in STRATEGIST mode):**

- [ ] **Core needs** — Scheduling, insurance verification, intake, referrals, HIPAA
- [ ] **Hidden goals** — Reduce no-shows, streamline intake, stay compliant
- [ ] **TRION service model** — Strategy, systems (EMR, compliance), coordination, reporting
- [ ] **Packages** — Fractional coordinator, done-with-you intake + scheduling, compliance audit + ongoing
- [ ] **Outreach** — Positioning for medical practice owners
- [ ] **Industry adaptation** — HIPAA, EMR integrations, medical-specific workflows

**Red flags:** Trion ignores HIPAA or medical context; suggests features that violate compliance.

---

## Test 4: Business website (non-job input)

**Input:** Paste this into the pitch chat or widget:

```
About Us: We're a boutique law firm specializing in estate planning. We help families protect their assets and plan for the future. Services: wills, trusts, power of attorney, probate. We've been in Sacramento for 15 years. Our clients value personal attention and clear communication.
```

**Expected output (Trion in STRATEGIST mode):**

- [ ] **Core needs** — Estate planning services, client communication, document management, probate
- [ ] **Hidden goals** — Scale without losing personal touch, reduce admin, capture more referrals
- [ ] **TRION service model** — How TRION serves a law firm as fractional ops/strategy
- [ ] **Packages** — Fractional intake/ops, done-with-you client onboarding, one-time systems blueprint
- [ ] **Outreach** — N/A (this is business info, not a job post) — but Trion should still design the offer
- [ ] **Industry adaptation** — Legal tools, confidentiality, bar rules if relevant

**Red flags:** Trion tries to build a barber-style site or ignores the law-firm context.

---

## Test 5: Normal sales flow (no paste)

**Input:** Type: `I'm a barber, my name is Mike`

**Expected output (Trion in SITE-BUILD mode):**

- [ ] Trion asks for or infers business type, builds site preview
- [ ] BIZDATA extracted, industry defaults applied
- [ ] "Build My Site" / site preview flow — NOT the full strategist output

**Red flags:** Trion outputs a 6-section strategist analysis for a simple "I'm a barber" message.

---

## Summary

| Test | Input type | Expected mode | Pass? |
|------|------------|---------------|-------|
| 1 | HVAC dispatcher job | STRATEGIST | |
| 2 | SaaS CSM job | STRATEGIST | |
| 3 | Medical coordinator job | STRATEGIST | |
| 4 | Law firm about page | STRATEGIST | |
| 5 | "I'm a barber" | SITE-BUILD | |

---

## Notes

- **Routing is instruction-based** — The LLM reads the system prompt and switches mode based on user input. There is no programmatic "if message.length > 200 then strategist" logic.
- **Both paths use same prompt** — Pitch page and VinceAssistant both use the full Trion prompt (from `/api/trion-prompt` or fallback) which includes the UNIVERSAL PRO MODEL section.
- **If tests fail** — Check that `lib/trion-agent.ts` has the UNIVERSAL PRO MODEL section and that VinceAssistant fetches from `/api/trion-prompt` (or uses the fallback with that section).
