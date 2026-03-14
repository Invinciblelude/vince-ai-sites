# Agent End-to-End: Answer, Log, Book

This doc describes how Trion agents perform end-to-end actions and what's needed for full deployment.

## What's Built

### 1. Skills (per business workspace)

When a client goes "Go Live", `setup-agent` creates:

| Skill | File | What it does |
|-------|------|---------------|
| **booking** | `skills/booking/SKILL.md` | Collects name, phone, service, date, time → appends to `data/bookings.jsonl` |
| **lead_capture** | `skills/lead-capture/SKILL.md` | Collects name, contact, interest → appends to `data/leads.jsonl` |
| **reminders** | `skills/reminders/SKILL.md` | Reads `bookings.jsonl`, outputs reminder messages |
| **reviews** | `skills/reviews/SKILL.md` | Logs review requests → appends to `data/review_requests.jsonl` |

### 2. SOUL (agent brain)

Each business gets a SOUL that says:
- "You ARE the CRM — you log directly into this workspace"
- "When you collect lead, client, or appointment info — use the bash tool to run the command from the skill"

### 3. OpenClaw Exec Tool

OpenClaw agents can run bash via the Exec tool. When the agent detects booking intent, it:
1. Collects name, phone, service, date, time from the conversation
2. Runs: `echo '{"date":"...","time":"...","name":"...",...}' >> $HOME/.openclaw/workspace-{slug}/data/bookings.jsonl`
3. Confirms to the user: "You're booked for [service] on [date] at [time]"

## What's Needed for Full E2E

| Component | Status | Action |
|-----------|--------|--------|
| **Skills** | ✅ Built | setup-agent creates them |
| **SOUL** | ✅ Built | Instructs agent to use bash |
| **OpenClaw gateway** | ⚠️ Manual | Run `openclaw gateway --port 18789` or install daemon |
| **Agent routing** | ✅ | openclaw.json binds agent to webchat |
| **Calendar sync** | ❌ Optional | See docs/INTEGRATIONS.md |
| **Reminder worker** | ❌ Optional | Cron that reads bookings.jsonl, sends SMS |

## Quick Test (Local)

1. Start gateway: `openclaw gateway --port 18789`
2. Open dashboard: `openclaw dashboard` → http://127.0.0.1:18789
3. Chat with an agent (e.g. Fresh Cuts Barbershop)
4. Say: "I want to book a haircut for tomorrow at 2pm"
5. Agent should collect info, run bash, confirm
6. Check: `cat $HOME/.openclaw/workspace-barbershop/data/bookings.jsonl`

## Daemon (24/7)

```bash
openclaw onboard --install-daemon
```

Starts on boot. No manual `openclaw gateway` needed.
