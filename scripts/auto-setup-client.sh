#!/bin/bash
# ============================================================
# AUTO CLIENT SETUP (from JSON file)
# Usage: bash scripts/auto-setup-client.sh client-info.json
# Reads client JSON and builds everything automatically
# ============================================================

if [ -z "$1" ]; then
  echo "Usage: bash scripts/auto-setup-client.sh <client-info.json>"
  exit 1
fi

JSON_FILE="$1"
if [ ! -f "$JSON_FILE" ]; then
  echo "File not found: $JSON_FILE"
  exit 1
fi

BIZ_NAME=$(python3 -c "import json; d=json.load(open('$JSON_FILE')); print(d.get('business_name',''))")
OWNER=$(python3 -c "import json; d=json.load(open('$JSON_FILE')); print(d.get('owner',''))")
BIZ_TYPE=$(python3 -c "import json; d=json.load(open('$JSON_FILE')); print(d.get('type',''))")
LOCATION=$(python3 -c "import json; d=json.load(open('$JSON_FILE')); print(d.get('location',''))")
PHONE=$(python3 -c "import json; d=json.load(open('$JSON_FILE')); print(d.get('phone',''))")
EMAIL=$(python3 -c "import json; d=json.load(open('$JSON_FILE')); print(d.get('email',''))")
HOURS=$(python3 -c "import json; d=json.load(open('$JSON_FILE')); print(d.get('hours',''))")
INSTAGRAM=$(python3 -c "import json; d=json.load(open('$JSON_FILE')); print(d.get('instagram',''))")
VIBE=$(python3 -c "import json; d=json.load(open('$JSON_FILE')); print(d.get('vibe','professional'))")
SERVICES=$(python3 -c "
import json
d=json.load(open('$JSON_FILE'))
svcs = d.get('services','')
if isinstance(svcs, list):
    for s in svcs: print(f'- {s}')
else:
    print(svcs)
")

SLUG=$(echo "$BIZ_NAME" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | tr -cd 'a-z0-9-')

echo "Auto-setting up: $BIZ_NAME ($SLUG)"

# Create OpenClaw workspace
WORKSPACE="$HOME/.openclaw/workspace-$SLUG"
mkdir -p "$WORKSPACE/skills/booking" "$WORKSPACE/skills/lead-capture" "$WORKSPACE/skills/reminders" "$WORKSPACE/skills/reviews" "$WORKSPACE/data"

# Generate SOUL.md
cat > "$WORKSPACE/SOUL.md" << SOULEOF
# $BIZ_NAME AI Assistant

You are the AI assistant for $BIZ_NAME, owned by $OWNER.

## Business Info
- Name: $BIZ_NAME
- Type: $BIZ_TYPE
- Address: $LOCATION
- Phone: $PHONE
- Email: $EMAIL
- Hours: $HOURS
- Instagram: $INSTAGRAM

## Services
$SERVICES

## Your Skills
1. **Book appointments** — collect customer name, phone, service, date/time and save it
2. **Capture leads** — log contact info from interested customers
3. **Send reminders** — prepare reminder messages for upcoming appointments
4. **Collect reviews** — ask happy customers for Google reviews after visits

## Your Behavior
- Be $VIBE, helpful, and keep answers SHORT (1-3 sentences)
- When someone wants to book, collect their name, phone, service, and preferred time
- Silently log leads when people share contact info
- If you don't know something, recommend calling $PHONE
- Never make up information not listed above
- You are the virtual receptionist. ACT like a real person.
SOULEOF

# Generate AGENTS.md
cat > "$WORKSPACE/AGENTS.md" << AGENTEOF
# Agent Rules
- You are the AI assistant for $BIZ_NAME
- Answer questions about services, prices, hours, and location
- Help customers book appointments by collecting their info
- Keep responses short and $VIBE
- Never make up information not in your SOUL.md
AGENTEOF

# Booking skill
cat > "$WORKSPACE/skills/booking/SKILL.md" << BOOKEOF
---
name: booking
description: Book appointments for customers
---
# Booking Skill
## Collect
1. Name  2. Phone  3. Service  4. Preferred date/time

\`\`\`bash
echo '{"name":"NAME","phone":"PHONE","service":"SERVICE","date":"DATE","time":"TIME","status":"pending","created":"TIMESTAMP"}' >> $WORKSPACE/data/bookings.jsonl
\`\`\`

Confirm: "You're booked for [service] on [date] at [time]. We'll confirm via text to [phone]!"
BOOKEOF

# Lead capture
cat > "$WORKSPACE/skills/lead-capture/SKILL.md" << LEADEOF
---
name: lead_capture
description: Captures customer contact info
---
# Lead Capture
Log every new customer who shares contact info.
\`\`\`bash
echo '{"name":"NAME","phone":"PHONE","interest":"INTEREST","created":"TIMESTAMP"}' >> $WORKSPACE/data/leads.jsonl
\`\`\`
Do this silently.
LEADEOF

# Reminders
cat > "$WORKSPACE/skills/reminders/SKILL.md" << REMEOF
---
name: reminders
description: Prepares reminder messages for upcoming bookings
---
# Reminders
Check: \`cat $WORKSPACE/data/bookings.jsonl\`
Day-before: "Hey [NAME]! Reminder — [SERVICE] tomorrow at [TIME]."
Same-day: "[NAME], your [SERVICE] is today at [TIME]. See you soon!"
REMEOF

# Reviews
cat > "$WORKSPACE/skills/reviews/SKILL.md" << REVEOF
---
name: reviews
description: Collects Google reviews from happy customers
---
# Review Collection
After appointments: "Thanks for coming in! Leave us a Google review: [LINK]"
\`\`\`bash
echo '{"name":"NAME","sent":"TIMESTAMP"}' >> $WORKSPACE/data/review_requests.jsonl
\`\`\`
REVEOF

# Save client config
cp "$JSON_FILE" "$WORKSPACE/client-config.json"

# Add to OpenClaw config
OPENCLAW_CFG="$HOME/.openclaw/openclaw.json"
python3 << PYEOF
import json

with open("$OPENCLAW_CFG") as f:
    cfg = json.load(f)

new_agent = {
    "id": "$SLUG",
    "name": "$BIZ_NAME",
    "workspace": "$WORKSPACE",
    "identity": {"name": "$BIZ_NAME AI"}
}

existing_ids = [a["id"] for a in cfg.get("agents", {}).get("list", [])]
if "$SLUG" not in existing_ids:
    cfg["agents"]["list"].append(new_agent)
    with open("$OPENCLAW_CFG", "w") as f:
        json.dump(cfg, f, indent=2)
    print("Added $BIZ_NAME to openclaw.json")
else:
    print("Agent $SLUG already exists in config")
PYEOF

echo ""
echo "DONE: $BIZ_NAME"
echo "  Workspace: $WORKSPACE"
echo "  Agent ID:  $SLUG"
echo ""
echo "Restart OpenClaw gateway to activate."
echo "Test in webchat."
