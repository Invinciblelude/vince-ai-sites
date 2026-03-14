#!/bin/bash
# ============================================================
# NEW CLIENT SETUP SCRIPT
# Run: bash scripts/new-client.sh
# Generates: OpenClaw agent + website config from client info
# ============================================================

echo "=============================="
echo "  NEW CLIENT SETUP"
echo "  AI Sites by Vince Dang"
echo "=============================="
echo ""

# Collect info
read -p "Business name: " BIZ_NAME
read -p "Owner name: " OWNER
read -p "Business type (barber, nail tech, salon, etc): " BIZ_TYPE
read -p "Location/address: " LOCATION
read -p "Phone: " PHONE
read -p "Email: " EMAIL
read -p "Hours (e.g. Mon-Fri 9am-7pm, Sat 8am-5pm): " HOURS
read -p "Instagram handle: " INSTAGRAM
read -p "Vibe (casual, professional, luxury, friendly): " VIBE
echo "Enter services (one per line, blank line to finish):"
SERVICES=""
while IFS= read -r line; do
  [ -z "$line" ] && break
  SERVICES="$SERVICES- $line
"
done

# Create slug from business name
SLUG=$(echo "$BIZ_NAME" | tr '[:upper:]' '[:lower:]' | tr ' ' '-' | tr -cd 'a-z0-9-')

echo ""
echo "Setting up: $BIZ_NAME ($SLUG)"
echo "=============================="

# 1. Create OpenClaw workspace
WORKSPACE="$HOME/.openclaw/workspace-$SLUG"
mkdir -p "$WORKSPACE/skills/booking" "$WORKSPACE/skills/lead-capture" "$WORKSPACE/skills/reminders" "$WORKSPACE/skills/reviews" "$WORKSPACE/data"

# 2. Generate SOUL.md
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

# 3. Generate AGENTS.md
cat > "$WORKSPACE/AGENTS.md" << AGENTEOF
# Agent Rules

- You are the AI assistant for $BIZ_NAME
- Answer questions about services, prices, hours, and location
- Help customers book appointments by collecting their info
- Keep responses short and $VIBE
- Never make up information not in your SOUL.md
AGENTEOF

# 4. Copy skill templates
cat > "$WORKSPACE/skills/booking/SKILL.md" << 'BOOKEOF'
---
name: booking
description: Book appointments for customers. Collects name, phone, service, and preferred date/time.
---

# Booking Skill

## When to use
Customer wants to book, schedule, or make an appointment.

## Collect (in order)
1. Name
2. Phone number
3. Service
4. Preferred date and time

## Save booking
```bash
echo '{"name":"NAME","phone":"PHONE","service":"SERVICE","date":"DATE","time":"TIME","status":"pending","created":"TIMESTAMP"}' >> WORKSPACE_PATH/data/bookings.jsonl
```

## After booking
Confirm back: "You're booked for [service] on [date] at [time]. We'll confirm via text to [phone]!"
BOOKEOF

# Fix the workspace path in booking skill
sed -i '' "s|WORKSPACE_PATH|$WORKSPACE|g" "$WORKSPACE/skills/booking/SKILL.md"

cat > "$WORKSPACE/skills/lead-capture/SKILL.md" << 'LEADEOF'
---
name: lead_capture
description: Captures customer contact info for follow-up.
---

# Lead Capture

Log every new customer who shares contact info but doesn't book.

```bash
echo '{"name":"NAME","phone":"PHONE","interest":"WHAT_THEY_ASKED","created":"TIMESTAMP"}' >> WORKSPACE_PATH/data/leads.jsonl
```

Do this silently. Don't tell the customer you're logging data.
LEADEOF

sed -i '' "s|WORKSPACE_PATH|$WORKSPACE|g" "$WORKSPACE/skills/lead-capture/SKILL.md"

cat > "$WORKSPACE/skills/reminders/SKILL.md" << 'REMEOF'
---
name: reminders
description: Checks upcoming bookings and prepares reminder messages.
---

# Reminders

Check bookings: `cat WORKSPACE_PATH/data/bookings.jsonl`

Day-before: "Hey [NAME]! Reminder — you've got [SERVICE] tomorrow at [TIME]. See you then!"
Same-day: "[NAME], your [SERVICE] is today at [TIME]. See you soon!"
REMEOF

sed -i '' "s|WORKSPACE_PATH|$WORKSPACE|g" "$WORKSPACE/skills/reminders/SKILL.md"

cat > "$WORKSPACE/skills/reviews/SKILL.md" << 'REVEOF'
---
name: reviews
description: Collects Google reviews from happy customers after appointments.
---

# Review Collection

After appointments: "Thanks for coming in! If you loved it, we'd appreciate a Google review: [LINK]. Thanks!"

Log: `echo '{"name":"NAME","sent":"TIMESTAMP"}' >> WORKSPACE_PATH/data/review_requests.jsonl`
REVEOF

sed -i '' "s|WORKSPACE_PATH|$WORKSPACE|g" "$WORKSPACE/skills/reviews/SKILL.md"

# 5. Generate widget embed code
WIDGET_CODE="<script
  src=\"https://YOUR-VERCEL-DOMAIN.vercel.app/widget.js\"
  data-name=\"$BIZ_NAME\"
  data-api=\"https://YOUR-VERCEL-DOMAIN.vercel.app/api/demo-chat\"
  data-color=\"#6d5cfc\"
  data-greeting=\"Hi! I'm the $BIZ_NAME assistant. Ask me about services, prices, or book an appointment!\"
  data-position=\"right\"
  data-questions=\"What are your prices?|Are you open today?|How do I book?\"
  data-prompt=\"You are the AI assistant for $BIZ_NAME. $BIZ_TYPE in $LOCATION. Phone: $PHONE. Hours: $HOURS. Services: $(echo "$SERVICES" | tr '\n' ' '). Be $VIBE and helpful. Keep answers to 1-3 sentences.\"
></script>"

# 6. Save client config
cat > "$WORKSPACE/client-config.json" << CFGEOF
{
  "slug": "$SLUG",
  "business_name": "$BIZ_NAME",
  "owner": "$OWNER",
  "type": "$BIZ_TYPE",
  "location": "$LOCATION",
  "phone": "$PHONE",
  "email": "$EMAIL",
  "hours": "$HOURS",
  "instagram": "$INSTAGRAM",
  "vibe": "$VIBE",
  "package": "pro",
  "status": "active",
  "created": "$(date -u +%Y-%m-%dT%H:%M:%SZ)"
}
CFGEOF

echo ""
echo "=============================="
echo "  SETUP COMPLETE"
echo "=============================="
echo ""
echo "Agent workspace: $WORKSPACE"
echo "Client config:   $WORKSPACE/client-config.json"
echo ""
echo "NEXT STEPS:"
echo "1. Add this agent to ~/.openclaw/openclaw.json:"
echo "   {"
echo "     \"id\": \"$SLUG\","
echo "     \"name\": \"$BIZ_NAME\","
echo "     \"workspace\": \"$WORKSPACE\","
echo "     \"identity\": { \"name\": \"$BIZ_NAME AI\" }"
echo "   }"
echo ""
echo "2. Restart the OpenClaw gateway"
echo ""
echo "3. Widget embed code (paste on any website):"
echo "$WIDGET_CODE"
echo ""
echo "4. Connect their channels (optional):"
echo "   openclaw channels login --account $SLUG"
echo ""
echo "Done! $BIZ_NAME is ready to go."
