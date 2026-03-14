# Trion Integrations: Voice Calls + Calendar/Booking

## Current State

- **Bookings**: Agent logs to `workspace-{slug}/data/bookings.jsonl` (JSONL, one booking per line)
- **Leads**: `leads.jsonl`
- **Reviews**: `review_requests.jsonl`
- **No calendar sync** — bookings are logged but not pushed to Google Calendar, Cal.com, etc.
- **No voice/call handling** — when someone calls the business number, it rings through; no AI answers

---

## 1. Voice Agent (When They Call)

When a customer calls the business, you want an AI to answer, schedule, log, etc.

### Options

| Provider | What it does | Cost |
|----------|--------------|------|
| **Vapi** | Voice AI. Twilio/VoIP → Vapi → your LLM. Answers, books, logs. | ~$0.05/min |
| **Bland.ai** | Same. Simple API. Forward number to Bland. | ~$0.08/min |
| **Retell** | Voice AI with low latency. | ~$0.05/min |
| **Twilio + custom** | You build: Twilio receives call → your API → LLM → Twilio TTS | More work |

### Flow

1. Business gets a phone number (Twilio, or port existing)
2. Incoming calls forward to Vapi/Bland/Retell
3. Voice AI uses your Trion SOUL + skills (or a call-specific prompt)
4. When caller books: agent extracts name, service, time → your API writes to `bookings.jsonl` (or calendar API)
5. Agent confirms: "You're booked for Tuesday at 2pm."

### What to Build

- API route: `POST /api/voice-booking` — accepts `{ name, phone, service, datetime }` from voice provider webhook
- Writes to `bookings.jsonl` in the correct workspace
- Voice provider calls this when the AI "books" during the call

---

## 2. Calendar / Booking Platform

Right now: **bookings.jsonl only**. No calendar.

### Options

| Option | How it works |
|--------|--------------|
| **Cal.com** | Open-source. API to create events. Agent or form submits → Cal.com creates event. |
| **Google Calendar API** | Agent writes to GCal. Need OAuth per business. |
| **Calendly** | Similar. API to create scheduling links or events. |
| **Custom calendar** | Read `bookings.jsonl` → render in a simple dashboard. No sync. |

### Recommended: Cal.com

1. Each business gets a Cal.com account (or you use one org with multiple event types)
2. Cal.com exposes API: `POST /api/bookings` with availability + event type
3. When Trion agent books:
   - Option A: Agent logs to `bookings.jsonl` + a worker syncs to Cal.com
   - Option B: Agent calls Cal.com API directly (needs Cal.com API key per workspace)

### Flow

```
Customer: "Book me for Tuesday 2pm"
  → Agent collects: name, phone, service, datetime
  → Agent calls: POST /api/booking (your API)
  → Your API: 1) appends to bookings.jsonl  2) POST to Cal.com API (if configured)
  → Agent: "You're booked. We'll send a confirmation."
```

### What to Build

- `POST /api/booking` — accepts booking payload, writes to workspace's `bookings.jsonl`
- Optional: Cal.com integration — same endpoint also creates Cal.com event when `CALCOM_API_KEY` is set for that workspace
- Simple dashboard: read `bookings.jsonl`, show list (or sync to a calendar view)

---

## 3. Summary

| Integration | Status | Next Step |
|-------------|--------|-----------|
| **Voice (call handling)** | Not built | Add Vapi/Bland, webhook to `POST /api/voice-booking` |
| **Calendar sync** | Not built | Add Cal.com API, or worker that reads bookings.jsonl → Cal.com |
| **Bookings** | Working | Agent logs to bookings.jsonl via skill |
