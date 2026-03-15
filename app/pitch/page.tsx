"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { INDUSTRIES, matchIndustry, buildIndustryKnowledgeBlock, TRION_ROLES, type IndustryProfile } from "@/lib/industries";
import { TRION_SKILLS_DISCLOSURE } from "@/lib/trion-skills";
import { useSpeechToText } from "@/lib/use-speech-to-text";

interface BusinessInfo {
  businessName: string;
  ownerName: string;
  type: string;
  services: string;
  hours: string;
  location: string;
  phone: string;
  email: string;
  vibe: string;
  goals: string;
  painPoints: string;
  features: string;
}

interface Message {
  role: "user" | "assistant";
  content: string;
}

const EMPTY_BIZ: BusinessInfo = {
  businessName: "",
  ownerName: "",
  type: "",
  services: "",
  hours: "",
  location: "",
  phone: "",
  email: "",
  vibe: "professional",
  goals: "",
  painPoints: "",
  features: "",
};

function getIndustryData(bizType: string): IndustryProfile {
  const matched = matchIndustry(bizType);
  if (matched) return matched;
  return INDUSTRIES.retail;
}

/** Merge biz with industry defaults — proactive: show full preview even when client hasn't given all details */
function getPreviewBiz(biz: BusinessInfo): BusinessInfo {
  const typeForLookup = biz.type || "barber"; // fallback for demo preview
  const industry = getIndustryData(typeForLookup);
  const typeLabel = (biz.type || typeForLookup).charAt(0).toUpperCase() + (biz.type || typeForLookup).slice(1);
  return {
    ...biz,
    type: biz.type || typeForLookup,
    businessName: biz.businessName || `${typeLabel} Business`,
    ownerName: biz.ownerName || "Owner",
    services: biz.services || industry.services.join("\n"),
    hours: biz.hours || industry.hours,
    painPoints: biz.painPoints || industry.painPoints.join(", "),
    features: biz.features || industry.aiSolves.join(", "),
    location: biz.location || "Location TBD",
  };
}

function getIndustryImages(bizType: string) {
  const profile = getIndustryData(bizType);
  return { hero: profile.hero, gallery: profile.gallery, accent: profile.accent };
}

const INDUSTRY_KNOWLEDGE = buildIndustryKnowledgeBlock();

const SALES_AGENT_PROMPT = `You are Trion — the AI business consultant from Trion Express. WE ARE HERE TO SUPPORT YOU. Be transparent: when asked "what can you do?" or "what skills?" — share the full list. When someone shares their business type, proactively tell them which skills apply to their business. You don't just build websites. You build an entire AI team for every business: a CEO brain, a COO, a CFO, a Secretary, and an Employee — all working 24/7.

You are an expert in EVERY industry: ${Object.values(INDUSTRIES).map(p => p.category).filter((v, i, a) => a.indexOf(v) === i).join(", ")}. You cover ${Object.keys(INDUSTRIES).length}+ business types. You don't collect info — you DIAGNOSE problems, PRESCRIBE the right AI team, and BUILD it.

WHAT MAKES TRION DIFFERENT — THE AI TEAM:
Every Trion agent isn't one AI — it's FIVE roles working together:

🧠 CEO BRAIN — Sees the big picture. Tracks revenue trends, identifies the #1 bottleneck, prioritizes what to fix. Thinks in quarters.
⚙️ COO — Runs operations. Every booking, order, lead, and follow-up flows through it. Eliminates manual steps, prevents double-bookings.
📊 CFO — Watches the money. Tracks average ticket, upsell rate, cost per lead, monthly recurring revenue. Knows when to raise prices.
📱 SECRETARY — First point of contact. Answers every call, text, DM, email instantly. Scheduling, confirmations, reminders. Never sleeps.
🔨 EMPLOYEE — Executes. Fills forms, collects documents, generates quotes, sends invoices, writes social posts, requests reviews.

INDUSTRY-SPECIFIC CAPABILITIES (what each role does changes by business type):

FOR SERVICE BUSINESSES (barbers, salons, spas, trainers, groomers, photographers):
CEO: Fill every slot, raise average ticket, identify when to hire
COO: Auto-schedule appointments, manage waitlists, enforce cancellation policies
CFO: Track revenue per service, flag upsell opportunities
Secretary: Book via text/web 24/7, send reminders, handle rescheduling
Employee: Request reviews, post social content, collect intake info, follow up no-shows

FOR RETAIL & E-COMMERCE (stores, boutiques, online shops):
CEO: Drive traffic, increase basket size, build lifetime value
COO: Track inventory, process orders, manage returns
CFO: Monitor margins per product, calculate customer acquisition cost
Secretary: Answer stock questions 24/7, handle order status inquiries
Employee: Recover abandoned carts, run loyalty programs, send restock alerts

FOR FOOD & BEVERAGE (restaurants, cafes, food trucks):
CEO: Increase table turnover, boost check average, build loyalty
COO: Manage reservations, handle takeout orders, coordinate events
CFO: Track food cost, online vs dine-in revenue
Secretary: Take reservations via text/web 24/7, respond to reviews
Employee: Send specials, manage waitlist, run 'we miss you' campaigns

FOR HOME SERVICES (contractors, plumbers, electricians, HVAC, landscapers, cleaners):
CEO: Close more estimates, build recurring maintenance revenue, scale crews
COO: Capture leads with photos, route emergencies, track job pipeline
CFO: Calculate job margins, track marketing ROI per channel
Secretary: Answer 24/7 even on job sites, schedule estimates, follow up on quotes
Employee: Send maintenance reminders, request reviews, run seasonal campaigns

FOR PROFESSIONAL SERVICES (lawyers, accountants, real estate, insurance):
CEO: Attract higher-value clients, build referral machine
COO: Automate intake screening, collect documents, manage deadlines
CFO: Track billable utilization, monitor collections
Secretary: Qualify leads 24/7 with priority scoring, schedule consultations
Employee: Send document checklists, run drip campaigns, collect testimonials

FOR HEALTHCARE (dentists, therapists, chiropractors):
CEO: Improve patient retention, fill schedule, grow practice
COO: Multi-provider scheduling, intake forms, insurance FAQ
CFO: Track production per provider, insurance vs cash mix
Secretary: Schedule 24/7, send recall reminders, answer insurance questions
Employee: Send appointment reminders, collect surveys, request reviews

FOR MANUFACTURING & PRINTING (fabrication, CNC, screen printing):
CEO: Reduce RFQ response time, find new verticals
COO: Collect RFQ specs, track orders, manage proofing
CFO: Track actual vs quoted costs, analyze customer profitability
Secretary: Answer order status 24/7, collect file uploads
Employee: Generate quotes from templates, send reorder reminders

FOR EVENTS (planners, DJs, venues, florists):
CEO: Book higher-value events, build referral pipeline
COO: Check date availability, coordinate vendor timelines
CFO: Track event profitability, monitor deposit collection
Secretary: Respond to inquiries with availability instantly
Employee: Generate proposals, post event photos, run anniversary campaigns

FOR EDUCATION (tutors, studios, academies):
CEO: Increase enrollment and retention
COO: Manage class schedules, waitlists, attendance
CFO: Track revenue per student, class fill rates
Secretary: Handle enrollment 24/7, send class reminders
Employee: Send progress reports, run seasonal enrollment campaigns

FOR AUTOMOTIVE (mechanics, body shops):
CEO: Build trust, increase repair ticket, create recurring revenue
COO: Triage symptoms, schedule around bay availability
CFO: Track profitability per service type
Secretary: AI symptom checker, book while mechanics work
Employee: Send maintenance reminders, follow up on declined services

FOR TECH & AGENCIES (marketing, web design, IT):
CEO: Grow retainers, reduce churn, scale without more staff
COO: Streamline onboarding, track deliverables, flag scope creep
CFO: Track profitability per client
Secretary: Qualify leads by budget/timeline, schedule discovery calls
Employee: Generate reports, create proposals, post content

Packages: Launch $500–$1,500 setup (optional $49–$99/mo) | Trion Ultra $750–$2,000 setup + $49–$199/mo (BEST). We emphasize recurring revenue. Live in 24hrs.

YOUR INDUSTRY DATABASE (${Object.keys(INDUSTRIES).length}+ industries):
${INDUSTRY_KNOWLEDGE}

If someone names a business you don't have exact data for, map to the closest industry. Welding shop → manufacturing. Florist → events + retail. Daycare → education. Towing → automotive. ALWAYS have an answer.

BE PROACTIVE — BUILD FIRST, REFINE LATER:
You build a site INSTANTLY with industry-standard details. Don't wait for every detail. As soon as you know their business type, you have enough to build. Use industry defaults for services, hours, pain points. The client can refine later.

CONVERSATION FLOW (2-3 messages):

MESSAGE 1: Warm greeting. Tell them Trion Express builds a full AI team for their business. Ask their business type and name. That's it.

MESSAGE 2 (BUILD IMMEDIATELY — The CEO Consult): When they tell you their business type:
1. **IMMEDIATELY include BIZDATA** with type, businessName (or placeholder), ownerName (or "Owner"), services (from industry defaults), hours (from industry), painPoints (from industry), features (from industry aiSolves). Use standard industry data — we refine per client later.
2. Pre-fill services with realistic prices from your industry database
3. DIAGNOSE pain points specific to their industry
4. Show them their AI TEAM — what each role does for THEIR business
5. **Tell them their site preview is ready** — "Hit 'Build My Site' below to see it. I've built it with standard [industry] details — we'll customize with your location, phone, and email next."
6. Recommend a package with a specific reason

Format:
"[Name], I know [business type] inside out. I've already built your site preview with standard [industry] details — **click 'Build My Site' below to see it.** Here's your Trion AI team:

**Your Services:** (from industry — they can tweak)
- Service 1 - $XX
(6-8 services)

**Hours:** [industry standard]

**What's costing you money right now:**
- [Industry-specific pain point 1]
- [Pain point 2]
- [Pain point 3]

**Your AI Team:**
🧠 CEO Brain: [What it tracks for their business]
⚙️ COO: [Operations it handles]
📱 Secretary: [How it handles communication]
🔨 Employee: [Tasks it executes daily]

I'd put you on **Trion Ultra** — $750–$2,000 setup + $49–$199/mo. Includes AI chat, auto-booking, CRM, review collection, and all 5 AI roles active. Recurring revenue model.

**Your site preview is ready below** — build it to see. Then share your location, phone, and email and we'll customize it."

MESSAGE 3: "Done — hit 'Build My Site' below. Full website with your AI team preview, service menu, booking, gallery. 60 seconds. Live with everything connected? 24 hours."

IF THEY ASK "WHAT CAN YOU DO?" — DEMONSTRATE:
Role-play as their business AI. Handle a mock booking perfectly. Then: "That's your Secretary. Working 24/7. Now imagine CEO tracking your revenue, COO optimizing your schedule, Employee collecting reviews — all at once."

IF UNSURE ABOUT NEEDS:
"What's your biggest headache? Missing calls? No online presence? Too much admin? Revenue plateau? Pick one and I'll show you which AI role fixes it."

DATA EXTRACTION:
|||BIZDATA|||{"businessName":"...","ownerName":"...","type":"...","services":"Service1 - $XX\\nService2 - $XX","hours":"...","location":"...","phone":"...","email":"...","goals":"...","painPoints":"...","features":"ceo-brain,coo-ops,cfo-revenue,secretary-comms,employee-tasks,booking,reviews,reminders,website,social"}|||END|||
- Include BIZDATA in your SECOND message as soon as you know their business type. Use industry defaults for services, hours, painPoints, features.
- businessName: use their name or "[Type] Shop" (e.g. "Barber Shop") if unknown
- ownerName: use their name or "Owner" if unknown
- type: REQUIRED — barber, nail, restaurant, contractor, etc. (from industry database)
- services, hours, painPoints, features: use industry defaults from your database when client hasn't specified
- Include in EVERY response once you have data.

UNIVERSAL PRO MODEL — When they paste a job posting, role description, or business info:
Switch to STRATEGIST mode. Extract core needs (5–10 bullets by theme), hidden goals/pain points, design TRION as a service (strategy, systems, coordination, reporting), define 2–3 packages (Fractional retainer, Done-with-you, One-time setup), write outreach script, note industry adaptations. Output structured, copy-paste ready. Speak as TRION EXPRESS (we/us).

RULES:
- Think like a CEO consultant, not a form collector
- DIAGNOSE before prescribing
- Pre-fill everything — they confirm, not create
- Show the AI TEAM concept — it's what makes Trion Express worth paying for
- Maximum 3 exchanges
- This conversation IS the product demo
- Never say chatbot. You're "Trion"
- Always end with a clear next action`;

function extractBizData(text: string): Partial<BusinessInfo> | null {
  const match = text.match(/\|\|\|BIZDATA\|\|\|([\s\S]*?)\|\|\|END\|\|\|/);
  if (!match) return null;
  try {
    return JSON.parse(match[1]);
  } catch {
    return null;
  }
}

function cleanMessageContent(text: string): string {
  return text.replace(/\|\|\|BIZDATA\|\|\|[\s\S]*?\|\|\|END\|\|\|/, "").trim();
}

function parseServiceLines(services: string) {
  return services.split("\n").filter((l) => l.trim());
}

export default function PitchPage() {
  const searchParams = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [biz, setBiz] = useState<BusinessInfo>(EMPTY_BIZ);
  const [showPreview, setShowPreview] = useState(false);
  const [readyToBuild, setReadyToBuild] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState("ultra");
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [agentSlug, setAgentSlug] = useState<string | null>(null);
  const [trionPrompt, setTrionPrompt] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<"ai" | "plans">("ai");
  const [demoDiscussionLog, setDemoDiscussionLog] = useState<{ role: "user" | "assistant"; text: string; at: string }[]>([]);
  const [demoBookings, setDemoBookings] = useState<{ name: string; date: string; time: string; topic: string }[]>([]);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingMessage, setBookingMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [activeSkill, setActiveSkill] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const lastFormSaveRef = useRef<string>("");
  const [sessionId] = useState(() =>
    typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : `s-${Date.now()}-${Math.random().toString(36).slice(2)}`
  );

  const { isListening, supported, toggle } = useSpeechToText((text) => setInput(text));

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, []);

  const wasLoadingRef = useRef(false);
  useEffect(() => {
    if (wasLoadingRef.current && !isLoading) {
      scrollToBottom();
    }
    wasLoadingRef.current = isLoading;
  }, [isLoading, scrollToBottom]);

  useEffect(() => {
    if (!isLoading && messages.length > 0) scrollToBottom();
  }, [messages.length, isLoading, scrollToBottom]);

  useEffect(() => {
    fetch("/api/trion-prompt")
      .then((r) => r.ok ? r.json() : null)
      .then((data) => data?.prompt && setTrionPrompt(data.prompt))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      if (window.location.hash === "#plans") {
        setActiveTab("plans");
      } else {
        // Land at top of hero when navigating to Trion Ultra, not in the middle of a section
        window.scrollTo(0, 0);
      }
    }
  }, []);

  // Pre-fill for analysis demo: ?analyze=URL
  useEffect(() => {
    const url = searchParams.get("analyze");
    if (url) {
      setInput(`Analyze this report and give me a structured financial analysis with scenarios: ${url}`);
      setActiveTab("ai");
    }
  }, [searchParams]);

  useEffect(() => {
    // Proactive: show Build when form has data OR chat says ready
    if (biz.type || biz.businessName) {
      setReadyToBuild(true);
      return;
    }
    if (biz.businessName && biz.ownerName && biz.type) {
      setReadyToBuild(true);
      return;
    }
    const last = messages[messages.length - 1];
    const ready =
      messages.length >= 2 &&
      last?.role === "assistant" &&
      (last?.content?.length ?? 0) > 80 &&
      /build my site|hit.*build|finalize|ready.*below|site preview is ready/i.test(last?.content ?? "");
    if (ready) setReadyToBuild(true);
  }, [biz, messages]);

  // Debounced: save form to backend + log when user fills Tell Me About You
  useEffect(() => {
    const hasData = biz.businessName || biz.ownerName || biz.type || biz.email || biz.phone;
    if (!hasData) return;
    const hash = `${biz.businessName}|${biz.ownerName}|${biz.type}|${biz.email}`;
    if (hash === lastFormSaveRef.current) return;
    const t = setTimeout(() => {
      lastFormSaveRef.current = hash;
      const summary = [
        biz.businessName && `Business: ${biz.businessName}`,
        biz.ownerName && `Owner: ${biz.ownerName}`,
        biz.type && `Type: ${biz.type}`,
        biz.services && `Services: ${parseServiceLines(biz.services).length} listed`,
        biz.location && `Location: ${biz.location}`,
        biz.email && `Email: ${biz.email}`,
        biz.phone && `Phone: ${biz.phone}`,
      ].filter(Boolean).join(" · ");
      if (summary) {
        const formNote = `Form entered: ${summary}`;
        setDemoDiscussionLog((prev) => [...prev, { role: "user", text: formNote, at: new Date().toLocaleTimeString() }]);
        fetch("/api/demo-conversation", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId, role: "user", content: formNote }),
        }).catch(() => {});
        fetch("/api/demo-form", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            businessName: biz.businessName,
            ownerName: biz.ownerName,
            type: biz.type,
            services: biz.services,
            location: biz.location,
            hours: biz.hours,
            phone: biz.phone,
            email: biz.email,
            goals: biz.goals,
            painPoints: biz.painPoints,
            features: biz.features,
          }),
        }).catch(() => {});
      }
    }, 2000);
    return () => clearTimeout(t);
  }, [biz.businessName, biz.ownerName, biz.type, biz.services, biz.location, biz.email, biz.phone]);

  const systemPrompt = trionPrompt ?? SALES_AGENT_PROMPT;

  async function saveFormToBackend(data: BusinessInfo) {
    const hasData = data.businessName || data.ownerName || data.type;
    if (!hasData) return;
    try {
      await fetch("/api/demo-form", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          businessName: data.businessName,
          ownerName: data.ownerName,
          type: data.type,
          services: data.services,
          location: data.location,
          hours: data.hours,
          phone: data.phone,
          email: data.email,
          goals: data.goals,
          painPoints: data.painPoints,
          features: data.features,
        }),
      });
    } catch { /* ignore */ }
  }

  function handleBuildSite() {
    saveFormToBackend(biz);
    setShowPreview(true);
    setTimeout(() => {
      previewRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 200);
  }

  async function handleGoLive() {
    if (!biz.email) {
      alert("The AI needs your email first! Tell it in the chat.");
      return;
    }
    setIsSaving(true);
    try {
      const res = await fetch("/api/save-client", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...biz, package: selectedPackage }),
      });
      const result = await res.json();
      if (res.ok && result.success) {
        setSaved(true);
        setAgentSlug(result.agentSlug || null);
      } else {
        alert(result.error || "Something went wrong. Try again!");
      }
    } catch {
      alert("Something went wrong. Try again!");
    } finally {
      setIsSaving(false);
    }
  }

  function logToDiscussion(role: "user" | "assistant", text: string) {
    const trimmed = text.trim().slice(0, 500);
    if (!trimmed) return;
    setDemoDiscussionLog((prev) => [...prev, { role, text: trimmed, at: new Date().toLocaleTimeString() }]);
    // Persist to backend
    fetch("/api/demo-conversation", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionId, role, content: text.trim().slice(0, 10000) }),
    }).catch(() => {});
  }

  async function saveLeadToBackend(interest: string) {
    try {
      await fetch("/api/demo-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: biz.ownerName || biz.businessName || "Visitor",
          contact: biz.email || biz.phone || "",
          interest: interest.trim().slice(0, 200),
        }),
      });
    } catch { /* ignore */ }
  }

  async function handleBooking(e: React.FormEvent) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const name = (form.querySelector('[name="booking-name"]') as HTMLInputElement)?.value?.trim();
    const date = (form.querySelector('[name="booking-date"]') as HTMLInputElement)?.value;
    const time = (form.querySelector('[name="booking-time"]') as HTMLInputElement)?.value;
    const topic = (form.querySelector('[name="booking-topic"]') as HTMLInputElement)?.value?.trim();
    if (!name || !date || !time || !topic) return;
    setBookingLoading(true);
    setBookingMessage(null);
    try {
      const res = await fetch("/api/demo-booking", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name || biz.ownerName || biz.businessName,
          email: biz.email,
          phone: biz.phone,
          date,
          time,
          topic,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (data.success) {
        setDemoBookings((prev) => [...prev, { name, date, time, topic }]);
        let msg = data.message || "Booked!";
        if (data.emailSent) msg += " Email sent to you.";
        else if (data.emailError) msg += ` (Email failed: ${data.emailError})`;
        setBookingMessage({ type: "success", text: msg });
        form.reset();
      } else {
        const msg = data.reason ? `${data.message || "Could not book."} ${data.reason}` : (data.message || "Could not book. Please try again.");
        setBookingMessage({ type: "error", text: msg });
      }
    } catch {
      setBookingMessage({ type: "error", text: "Connection error. Please try again." });
    } finally {
      setBookingLoading(false);
      setTimeout(() => setBookingMessage(null), 5000);
    }
  }

  async function handleChat(e: React.FormEvent) {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: Message = { role: "user", content: input.trim() };
    logToDiscussion("user", input.trim());
    saveLeadToBackend(input.trim());
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/trion-agent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ systemPrompt, messages: newMessages }),
      });

      if (!res.ok) throw new Error("Failed");
      const skill = res.headers.get("X-Trion-Skill");
      const skillName = res.headers.get("X-Trion-Skill-Name");
      if (skill) setActiveSkill(skillName ?? skill);
      const reader = res.body?.getReader();
      if (!reader) throw new Error("No stream");

      const decoder = new TextDecoder();
      let fullContent = "";
      setMessages((prev) => [...prev, { role: "assistant", content: "" }]);

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        for (const line of decoder.decode(value, { stream: true }).split("\n")) {
          if (line.startsWith("data: ")) {
            const data = line.slice(6);
            if (data === "[DONE]") break;
            try {
              const delta = JSON.parse(data).choices?.[0]?.delta?.content;
              if (delta) {
                fullContent += delta;
                const display = cleanMessageContent(fullContent);
                setMessages((prev) => {
                  const u = [...prev];
                  u[u.length - 1] = { role: "assistant", content: display };
                  return u;
                });
              }
            } catch { /* skip */ }
          }
        }
      }

      const extracted = extractBizData(fullContent);
      if (extracted) {
        setBiz((prev) => ({
          ...prev,
          ...Object.fromEntries(
            Object.entries(extracted).filter(([, v]) => v && String(v).trim())
          ),
        }));
      }
      logToDiscussion("assistant", cleanMessageContent(fullContent));
    } catch {
      const errMsg = "Connection hiccup — try sending that again!";
      setMessages((prev) => [...prev, { role: "assistant", content: errMsg }]);
      logToDiscussion("assistant", errMsg);
    } finally {
      setIsLoading(false);
    }
  }

  const serviceLines = parseServiceLines(biz.services);
  const previewBiz = getPreviewBiz(biz);
  const previewServiceLines = parseServiceLines(previewBiz.services);

  return (
    <div className="animate-fade-in">
      {/* Hero + Chat Section */}
      <section className="relative min-h-screen">
        <div className="absolute inset-0 bg-gradient-to-b from-accent/10 via-transparent to-transparent" />

        <div className="relative mx-auto max-w-6xl px-4 pt-10 pb-8">
          {/* Top left — Logo + Trion Express (proportional) */}
          <div className="mb-8 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-accent/10 via-accent/5 to-accent/20 ring-1 ring-accent/20 overflow-hidden sm:h-10 sm:w-10">
                <Image src="/trion-express-logo-orange.png" alt="" width={40} height={40} className="object-contain" priority />
              </div>
              <span className="text-lg font-bold tracking-tight text-foreground sm:text-xl">Trion Express</span>
            </div>
            <span className="inline-flex items-center gap-2 rounded-full bg-green/10 px-3 py-1 text-xs font-medium text-green sm:text-sm">
              <span className="relative flex h-1.5 w-1.5 sm:h-2 sm:w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green opacity-75"></span><span className="relative inline-flex h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full bg-green"></span></span>
              Trion is Live
            </span>
          </div>

          {/* Hero content */}
          <div className="mb-8 text-center">
            <h1 className="mb-3 text-4xl font-bold sm:text-5xl">
              AI Business Team — Answer, Book & Grow 24/7
            </h1>
            <p className="mb-2 text-lg font-semibold text-accent">
              I&apos;m Trion. I answer customers, make appointments, capture leads, and collect reviews — so you don&apos;t miss a sale.
            </p>
            <p className="mx-auto max-w-2xl text-muted">
              Barbers, salons, restaurants, contractors — any business that needs to answer customers 24/7. I run as five roles: CEO, COO, CFO, Secretary, Employee. 16 live sites built across 8 industries.
            </p>
          </div>

          {/* Tabs */}
          <div className="mb-6 flex rounded-xl border border-border bg-card p-1">
            <button
              onClick={() => { setActiveTab("ai"); if (typeof window !== "undefined") window.history.replaceState(null, "", "/pitch"); }}
              className={`flex-1 rounded-lg px-6 py-3 text-sm font-medium transition-all ${
                activeTab === "ai" ? "bg-accent text-white shadow" : "text-muted hover:text-foreground hover:bg-accent/5"
              }`}
            >
              Talk to Trion
            </button>
            <button
              onClick={() => { setActiveTab("plans"); if (typeof window !== "undefined") window.history.replaceState(null, "", "/pitch#plans"); }}
              className={`flex-1 rounded-lg px-6 py-3 text-sm font-medium transition-all ${
                activeTab === "plans" ? "bg-accent text-white shadow" : "text-muted hover:text-foreground hover:bg-accent/5"
              }`}
            >
              Plans & Pricing
            </button>
          </div>

          {/* Tab content */}
          {activeTab === "plans" ? (
            <div id="plans" className="rounded-2xl border border-border bg-card p-8 sm:p-10">
              <h2 className="mb-2 text-center text-2xl font-bold">Plans & Pricing</h2>
              <p className="mb-8 text-center text-sm text-muted">Pick a plan. Switch to &quot;Talk to Trion&quot; to build your site. Live in 24 hours.</p>
              <div className="grid gap-6 sm:grid-cols-2">
                {([
                  { key: "launch", name: "Launch Package", setup: "$500–$1,500", mo: "", sub: "Optional: $49–$99/mo hosting + updates + AI tuning", features: ["1–5 page website (Home, About, Services, Gallery, Contact)", "Basic SEO + mobile-friendly", "AI assistant on site to answer FAQs and capture leads", "Contact forms and notifications", "1–2 rounds of revisions"], popular: false },
                  { key: "ultra", name: "Trion Ultra", setup: "$750–$2,000", mo: "$49–$199/mo", sub: "Recurring revenue model. Best for: I want AI in my whole business", features: ["Everything in Launch Package", "Multi-channel AI (site chat + SMS/email)", "Workflow automations (follow-ups, reminders, CRM)", "Multiple agent roles (reception, FAQ, intake)", "Monthly optimization and reporting"], popular: true },
                ] as const).map((pkg) => (
                  <div
                    key={pkg.key}
                    className={`relative flex min-h-[220px] flex-col rounded-xl border p-6 text-left ${
                      pkg.popular ? "border-accent bg-accent/5 shadow-lg" : "border-border bg-card"
                    }`}
                  >
                    {pkg.popular && (
                      <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-0.5 text-[10px] font-bold text-white">AI BUSINESS TEAM</div>
                    )}
                    <div className="font-bold text-lg">{pkg.name}</div>
                    <div className="text-accent font-semibold mt-2 text-base">{pkg.setup}{pkg.mo ? ` + ${pkg.mo}` : ""}</div>
                    {pkg.sub && <div className="text-xs text-muted mt-0.5">{pkg.sub}</div>}
                    <ul className="mt-4 flex-1 space-y-2 text-sm">
                      {pkg.features.map((f, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-muted">
                          <span className="text-green mt-0.5 shrink-0">&#10003;</span>{f}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              <p className="mt-6 text-center text-sm text-muted">No contracts. Cancel anytime. We emphasize recurring revenue in our model.</p>
              <div className="mt-8 text-center">
                <button
                  onClick={() => setActiveTab("ai")}
                  className="rounded-xl bg-accent px-8 py-3 font-semibold text-white transition-colors hover:bg-accent-dim"
                >
                  Talk to Trion — Get Started
                </button>
              </div>
            </div>
          ) : (
          <>
          {/* AI Team — compact, proportional */}
          <div className="mb-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 rounded-xl border border-border bg-card px-4 py-3">
            {Object.entries(TRION_ROLES).map(([key, role]) => (
              <div key={key} className="flex items-center gap-2 min-w-0">
                <span className="text-sm shrink-0">{role.icon}</span>
                <div className="min-w-0 truncate">
                  <div className="text-[10px] sm:text-[11px] font-medium truncate">{role.title.split(" — ")[0]}</div>
                  <div className="text-[9px] text-muted truncate hidden sm:block">{role.title.split(" — ")[1]}</div>
                </div>
              </div>
            ))}
            <div className="col-span-2 sm:col-span-3 lg:col-span-1 flex items-center justify-end lg:justify-center">
              <span className="rounded-lg bg-accent/5 border border-accent/10 px-2 py-0.5 text-[10px] text-muted">24/7</span>
            </div>
          </div>

          {/* Main 2-col layout: Left (Chat + Support) | Right (Tell Me About You) */}
          <div className="grid gap-6 lg:grid-cols-2 lg:gap-8 lg:items-stretch">
            {/* Left — Chat + We're Here To Support You */}
            <div className="min-w-0 flex flex-col gap-4">
              <div className="flex min-h-[300px] flex-1 flex-col rounded-2xl border border-border bg-card shadow-lg">
                {/* Chat header */}
                <div className="flex items-center gap-3 rounded-t-2xl bg-accent px-5 py-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20 text-sm font-bold text-white">T</div>
                  <div>
                    <div className="font-semibold text-white">Trion</div>
                    <div className="text-xs text-white/70">
                      {activeSkill ? `${activeSkill} mode` : "AI Business Consultant — live demo"}
                    </div>
                  </div>
                  <div className="ml-auto flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-xs text-white/80">
                    <span className="relative flex h-1.5 w-1.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green opacity-75"></span><span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green"></span></span>
                    Online 24/7
                  </div>
                </div>

                {/* Messages */}
                <div className="flex-1 overflow-y-auto px-5 py-4" style={{ overflowAnchor: "auto" } as React.CSSProperties}>
                  {/* Welcome message */}
                  {messages.length === 0 && (
                    <div className="space-y-4">
                      <div className="max-w-[88%]">
                        <div className="rounded-2xl rounded-tl-sm bg-background px-4 py-3 text-sm leading-relaxed">
                          Hey! I&apos;m Trion — your AI business consultant. <strong>We&apos;re here to support you.</strong> I can build your site, answer customers 24/7, make appointments, capture leads, and more. Tell me your business type and name, and I&apos;ll show you exactly which skills apply to you — and have your site ready in 60 seconds.
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-2 pt-1">
                        {[
                          { label: "Barber / Salon", msg: "I'm a barber, my name is " },
                          { label: "Nail / Lash tech", msg: "I'm a nail tech, my name is " },
                          { label: "Restaurant / Food", msg: "I own a restaurant, my name is " },
                          { label: "Contractor / Trades", msg: "I'm a contractor, my name is " },
                          { label: "Retail / Store", msg: "I own a retail store, my name is " },
                          { label: "E-commerce", msg: "I sell products online, my name is " },
                          { label: "Real estate", msg: "I'm a real estate agent, my name is " },
                          { label: "Manufacturing", msg: "I run a manufacturing shop, my name is " },
                          { label: "Law / Accounting", msg: "I run a law firm, my name is " },
                          { label: "Healthcare", msg: "I run a dental office, my name is " },
                          { label: "Auto repair", msg: "I own an auto shop, my name is " },
                          { label: "Analyze job/role", msg: "Analyze this and design a TRION service offer:\n\n" },
                          { label: "Other", msg: "I run a business called " },
                          { label: "What can you do?", msg: "What can you do? What skills do you have?" },
                        ].map((q) => (
                          <button
                            key={q.label}
                            onClick={() => setInput(q.msg)}
                            className="rounded-full border border-border bg-background px-3.5 py-2 text-xs transition-all hover:border-accent hover:text-accent hover:bg-accent/5"
                          >
                            {q.label}
                          </button>
                        ))}
                      </div>
                      <p className="text-[11px] text-muted px-1">Tap your industry, add your name, and send. Trion handles the rest — services, pricing, diagnosis, solutions, and your full site.</p>
                    </div>
                  )}

                  {messages.map((msg, i) => (
                    <div key={i} className={`mb-3 flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[88%] rounded-2xl px-4 py-3 text-sm leading-relaxed ${
                        msg.role === "user"
                          ? "rounded-tr-sm bg-accent text-white"
                          : "rounded-tl-sm bg-background"
                      }`}>
                        <div className="whitespace-pre-wrap">{msg.content}</div>
                      </div>
                    </div>
                  ))}

                  {isLoading && messages[messages.length - 1]?.role !== "assistant" && (
                    <div className="mb-3">
                      <div className="max-w-[88%] rounded-2xl rounded-tl-sm bg-background px-4 py-3 text-sm">
                        <div className="flex items-center gap-1.5 text-muted">
                          <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-accent [animation-delay:0ms]"></span>
                          <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-accent [animation-delay:150ms]"></span>
                          <span className="inline-block h-1.5 w-1.5 animate-bounce rounded-full bg-accent [animation-delay:300ms]"></span>
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>

                {/* Build site button */}
                {readyToBuild && !showPreview && (
                  <div className="border-t border-green/20 bg-green/5 px-5 py-3">
                    <button
                      onClick={handleBuildSite}
                      className="w-full rounded-xl bg-green py-3 font-semibold text-white transition-all hover:bg-green/90 hover:scale-[1.01]"
                    >
                      Build {biz.businessName ? `"${biz.businessName}"` : biz.type ? `your ${biz.type}` : "My"} AI Site Now
                    </button>
                  </div>
                )}

                {showPreview && !saved && (
                  <div className="border-t border-accent/20 bg-accent/5 px-5 py-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-accent font-medium">Site preview ready below</span>
                      <a href="#preview" onClick={() => previewRef.current?.scrollIntoView({ behavior: "smooth" })} className="text-accent hover:underline">
                        Jump to preview &darr;
                      </a>
                    </div>
                  </div>
                )}

                {/* Input */}
                <form onSubmit={handleChat} className="border-t border-border p-4">
                  <div className="flex gap-2">
                    <input
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      placeholder="Tell me about your business..."
                      className="flex-1 rounded-xl border border-border bg-background px-4 py-3 text-sm outline-none focus:border-accent transition-colors"
                      disabled={isLoading}
                    />
                    {supported && (
                      <button
                        type="button"
                        onClick={toggle}
                        title={isListening ? "Stop listening" : "Speak"}
                        className={`shrink-0 rounded-xl px-4 py-3 transition-colors ${
                          isListening ? "bg-red-500 text-white" : "bg-muted text-muted-foreground hover:bg-accent/10 hover:text-accent"
                        }`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                          <path d="M12 2a4 4 0 0 1 4 4v6a4 4 0 0 1-8 0V6a4 4 0 0 1 4-4Z" />
                          <path d="M5 11a1 1 0 0 1 1 1 6 6 0 0 0 12 0 1 1 0 1 1 2 0 8 8 0 0 1-16 0 1 1 0 0 1 1-1Z" />
                        </svg>
                      </button>
                    )}
                    <button
                      type="submit"
                      disabled={!input.trim() || isLoading}
                      className="rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-accent-dim disabled:opacity-30"
                    >
                      Send
                    </button>
                  </div>
                </form>
              </div>

              {/* We're Here To Support You — below chat, left column */}
              <div className="flex min-h-[240px] flex-1 flex-col rounded-2xl border border-accent/20 bg-accent/5 p-6 shadow-sm">
                <h3 className="mb-2 text-sm font-bold uppercase tracking-wider text-accent">
                  We&apos;re Here To Support You
                </h3>
                <p className="mb-3 text-xs text-muted">
                  Skills we can apply to your business or services:
                </p>
                <div className="min-h-0 flex-1 overflow-y-auto space-y-2">
                  {TRION_SKILLS_DISCLOSURE.map((s, i) => (
                    <div key={i} className="rounded-lg border border-border/50 bg-card/50 px-3 py-2 text-xs">
                      <span className="font-semibold text-foreground">{s.name}</span>
                      <span className="text-muted"> — {s.desc}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-2 text-[10px] text-muted shrink-0">
                  Ask Trion &quot;what can you do?&quot; for the full list.
                </p>
              </div>
            </div>

            {/* Right — Tell Me About You */}
            <div className="min-w-0 flex flex-col">
              <div className="flex min-h-[300px] flex-1 flex-col rounded-2xl border border-border bg-card p-6 shadow-lg">
                <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-accent">
                  Tell Me About You
                </h3>
                <p className="mb-3 text-xs text-muted">
                  Fill in below or chat with Trion — both update your preview.
                </p>
                <div className="min-h-0 flex-1 space-y-3 overflow-y-auto text-sm">
                  <InputRow label="Business" value={biz.businessName} onChange={(v) => setBiz((p) => ({ ...p, businessName: v }))} placeholder="Your business name" />
                  <InputRow label="Owner" value={biz.ownerName} onChange={(v) => setBiz((p) => ({ ...p, ownerName: v }))} placeholder="Your name" />
                  <InputRow label="Type" value={biz.type} onChange={(v) => setBiz((p) => ({ ...p, type: v }))} placeholder="e.g. barber, restaurant, contractor" />
                  <InputRow label="Services" value={biz.services} onChange={(v) => setBiz((p) => ({ ...p, services: v }))} placeholder="Haircut - $30, Color - $85 (one per line)" textarea />
                  <InputRow label="Location" value={biz.location} onChange={(v) => setBiz((p) => ({ ...p, location: v }))} placeholder="City, address" />
                  <InputRow label="Hours" value={biz.hours} onChange={(v) => setBiz((p) => ({ ...p, hours: v }))} placeholder="Mon-Sat 9am-6pm" />
                  <InputRow label="Phone" value={biz.phone} onChange={(v) => setBiz((p) => ({ ...p, phone: v }))} placeholder="(555) 123-4567" />
                  <InputRow label="Email" value={biz.email} onChange={(v) => setBiz((p) => ({ ...p, email: v }))} placeholder="you@business.com" />
                  <InputRow label="Goals" value={biz.goals} onChange={(v) => setBiz((p) => ({ ...p, goals: v }))} placeholder="What do you want to achieve?" textarea />
                  <InputRow label="Pain Points" value={biz.painPoints} onChange={(v) => setBiz((p) => ({ ...p, painPoints: v }))} placeholder="What's costing you time or money?" textarea />
                  <InputRow label="AI Features" value={biz.features} onChange={(v) => setBiz((p) => ({ ...p, features: v }))} placeholder="appointments, reviews, reminders..." textarea />
                </div>
                <button
                  onClick={handleBuildSite}
                  disabled={!biz.type && !biz.businessName}
                  className="mt-4 w-full rounded-lg bg-green py-2.5 text-sm font-semibold text-white transition-colors hover:bg-green/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {showPreview ? "View preview below ↓" : "Build live preview"}
                </button>
                {!biz.type && !biz.businessName && (
                  <p className="mt-2 text-xs text-muted text-center">
                    Add business name or type above to build preview.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Skills in action — full-width, emphasized */}
          <div className="mt-8 rounded-2xl border-2 border-accent/20 bg-accent/5 p-6 sm:p-8">
            <div className="mb-6 text-center">
              <h3 className="text-xl font-bold">Skills in Action</h3>
              <p className="mt-1 text-sm text-muted">Make an appointment and log discussion topics — see the agent work in real time.</p>
            </div>
            <div className="grid gap-6 lg:grid-cols-2">
              {/* Make an appointment */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-green/10 text-2xl">📅</span>
                  <div>
                    <div className="font-semibold text-base">Make an appointment</div>
                    <div className="text-sm text-muted">Add to calendar instantly</div>
                  </div>
                </div>
                <form onSubmit={handleBooking} className="space-y-3">
                  <input name="booking-name" placeholder="Your name" defaultValue={biz.ownerName || biz.businessName} className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm" required />
                  <div className="grid grid-cols-2 gap-3">
                    <input name="booking-date" type="date" aria-label="Preferred date" className="rounded-lg border border-border bg-background px-4 py-3 text-sm" required />
                    <input name="booking-time" type="time" aria-label="Preferred time" className="rounded-lg border border-border bg-background px-4 py-3 text-sm" required />
                  </div>
                  <input name="booking-topic" placeholder="Topic / interest" className="w-full rounded-lg border border-border bg-background px-4 py-3 text-sm" required />
                  <button type="submit" disabled={bookingLoading} className="w-full rounded-xl bg-green py-3.5 text-sm font-semibold text-white transition-colors hover:bg-green/90 disabled:opacity-50">
                    {bookingLoading ? "Checking availability…" : "Schedule appointment"}
                  </button>
                  {bookingMessage && (
                    <div className={`rounded-lg px-4 py-3 text-sm ${bookingMessage.type === "success" ? "bg-green/10 text-green" : "bg-red-500/10 text-red-600"}`}>
                      {bookingMessage.type === "success" ? "✓" : "⚠"} {bookingMessage.text}
                      {bookingMessage.type === "error" && (
                        <a href="/setup" className="block mt-2 text-xs underline">
                          Fix Supabase setup →
                        </a>
                      )}
                    </div>
                  )}
                </form>
                {demoBookings.length > 0 && (
                  <div className="mt-4 space-y-2 border-t border-border pt-4">
                    <div className="text-xs font-semibold uppercase tracking-wider text-muted">Confirmed</div>
                    {demoBookings.slice(-3).reverse().map((b, i) => (
                      <div key={i} className="rounded-lg bg-green/10 px-4 py-2.5 text-sm">
                        <span className="font-medium">{b.name}</span> — {b.date} {b.time} · {b.topic}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {/* Discussion topics */}
              <div className="rounded-xl border border-border bg-card p-6 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-accent/10 text-2xl">📋</span>
                  <div>
                    <div className="font-semibold text-base">Discussion topics</div>
                    <div className="text-sm text-muted">Logged as you chat</div>
                  </div>
                </div>
                <div className="min-h-[140px] max-h-48 overflow-y-auto space-y-2 rounded-lg bg-background/50 p-4">
                  {demoDiscussionLog.length === 0 ? (
                    <p className="text-sm text-muted">Full conversation (you + Trion) appears here as you chat above.</p>
                  ) : (
                    demoDiscussionLog.map((item, i) => (
                      <div key={i} className={`flex gap-3 rounded-lg px-3 py-2.5 ${item.role === "user" ? "bg-accent/10 border-l-2 border-accent" : "bg-background"}`}>
                        <span className="shrink-0 text-xs text-muted">{item.at}</span>
                        <div className="min-w-0 flex-1">
                          <span className="text-[10px] font-medium uppercase text-muted">{item.role}</span>
                          <p className="text-sm line-clamp-3 mt-0.5">{item.text}</p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
          </>
          )}
        </div>
      </section>

      {/* Generated Site Preview */}
      {showPreview && (
        <section ref={previewRef} id="preview" className="border-t-2 border-accent">
          {/* Preview banner */}
          <div className="bg-accent/10 px-4 py-3 text-center">
            <span className="text-sm font-medium text-accent">LIVE PREVIEW</span>
            <span className="text-sm text-muted"> — This is what your customers would see.</span>
            {!saved && (
              <span className="text-sm text-muted"> Built from our conversation.</span>
            )}
          </div>

          {saved ? (
            <div className="mx-auto max-w-2xl px-4 py-20 text-center">
              <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green/10 text-4xl">&#10003;</div>
              <h2 className="mb-3 text-3xl font-bold">You&apos;re All Set, {biz.ownerName || "Boss"}!</h2>
              <p className="mb-2 text-lg text-muted"><strong>{biz.businessName}</strong> is in the system.</p>
              <p className="mb-8 text-muted">Your AI assistant is being built right now. Everything from this conversation — your services, pricing, hours, and business goals — is already loaded in.</p>
              <div className="rounded-xl border border-border bg-card p-6 text-left text-sm mb-8">
                <h3 className="mb-4 font-bold text-base">Here&apos;s what&apos;s happening automatically:</h3>
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green/10 text-xs text-green">&#10003;</span>
                    <div><span className="font-medium">Business profile saved</span><br /><span className="text-muted">Services, pricing, hours, location — all stored</span></div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green/10 text-xs text-green">&#10003;</span>
                    <div><span className="font-medium">Pain points diagnosed</span><br /><span className="text-muted">{biz.painPoints || "Industry-specific solutions mapped"}</span></div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs ${agentSlug ? "bg-green/10 text-green" : "bg-accent/10 text-accent"}`}>{agentSlug ? "\u2713" : "\u2022"}</span>
                    <div><span className="font-medium">AI assistant {agentSlug ? "created" : "creating..."}</span><br /><span className="text-muted">{agentSlug ? `Workspace: ${agentSlug} — trained on your business` : "Setting up booking, lead capture, reminders, reviews"}</span></div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs text-accent">&#x2022;</span>
                    <div><span className="font-medium">Website + AI connected</span><br /><span className="text-muted">Your site is connected within 24 hours</span></div>
                  </div>
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent/10 text-xs text-accent">&#x2022;</span>
                    <div><span className="font-medium">You review before going live</span><br /><span className="text-muted">Nothing goes public until you approve it</span></div>
                  </div>
                </div>
              </div>
              {biz.features && (
                <div className="rounded-xl border border-border bg-card p-6 text-left text-sm mb-8">
                  <h3 className="mb-3 font-bold">Your AI will handle:</h3>
                  <div className="flex flex-wrap gap-2">
                    {biz.features.split(",").map((f) => (
                      <span key={f} className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent">{f.trim()}</span>
                    ))}
                  </div>
                </div>
              )}
              <Link href="/pitch" className="rounded-xl bg-accent px-8 py-3.5 font-semibold text-white transition-colors hover:bg-accent-dim">
                Back to Meet Trion
              </Link>
            </div>
          ) : (
            <div>
              {(() => {
                const imgs = getIndustryImages(previewBiz.type);
                return (
                  <>
                    {/* Hero banner with image */}
                    <div className="relative h-[400px] w-full overflow-hidden">
                      <img
                        src={imgs.hero}
                        alt={`${previewBiz.type} business`}
                        className="h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                      <div className="absolute inset-0 flex flex-col items-center justify-end pb-12 text-center px-4">
                        <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full border-4 border-white/20 bg-background/80 backdrop-blur text-3xl font-bold" style={{ color: imgs.accent }}>
                          {previewBiz.businessName.charAt(0)?.toUpperCase() || "?"}
                        </div>
                        <h2 className="mb-2 text-4xl font-bold text-white drop-shadow-lg">{previewBiz.businessName || "Your Business"}</h2>
                        <p className="text-white/80">{previewBiz.type}{previewBiz.location ? ` \u2022 ${previewBiz.location}` : ""}</p>
                        <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                          {previewBiz.hours && (
                            <span className="rounded-full bg-white/10 backdrop-blur px-4 py-1.5 text-sm text-white">{previewBiz.hours}</span>
                          )}
                          {previewBiz.phone && (
                            <a href={`tel:${previewBiz.phone}`} className="rounded-full bg-white/10 backdrop-blur px-4 py-1.5 text-sm text-white hover:bg-white/20 transition-colors">{previewBiz.phone}</a>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="mx-auto max-w-4xl px-4 py-12">
                      {/* Services with image accents */}
                      {previewServiceLines.length > 0 && (
                        <section className="mb-16">
                          <h3 className="mb-6 text-center text-2xl font-bold">Our Services</h3>
                          <div className="grid gap-4 sm:grid-cols-2">
                            {previewServiceLines.map((line, i) => {
                              const dollarIdx = line.lastIndexOf("$");
                              const dashIdx = line.lastIndexOf("-");
                              let name = line, price = "";
                              if (dollarIdx > 0) {
                                name = line.slice(0, dollarIdx).replace(/-\s*$/, "").trim();
                                price = line.slice(dollarIdx).trim();
                              } else if (dashIdx > 0) {
                                name = line.slice(0, dashIdx).trim();
                                price = line.slice(dashIdx + 1).trim();
                              }
                              return (
                                <div key={i} className="group flex items-center gap-4 rounded-xl border border-border bg-card p-4 transition-all hover:border-accent/30 hover:shadow-md">
                                  <div className="h-14 w-14 shrink-0 overflow-hidden rounded-lg">
                                    <img
                                      src={imgs.gallery[i % imgs.gallery.length]}
                                      alt={name}
                                      className="h-full w-full object-cover transition-transform group-hover:scale-110"
                                    />
                                  </div>
                                  <div className="flex-1">
                                    <div className="font-semibold">{name}</div>
                                  </div>
                                  {price && <div className="text-lg font-bold" style={{ color: imgs.accent }}>{price}</div>}
                                </div>
                              );
                            })}
                          </div>
                        </section>
                      )}

                      {/* Gallery */}
                      <section className="mb-16">
                        <h3 className="mb-6 text-center text-2xl font-bold">Gallery</h3>
                        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                          {imgs.gallery.map((src, i) => (
                            <div key={i} className="group aspect-square overflow-hidden rounded-xl">
                              <img
                                src={src}
                                alt={`${previewBiz.businessName} gallery ${i + 1}`}
                                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                              />
                            </div>
                          ))}
                        </div>
                      </section>

                      {/* Booking form with image side */}
                      <section className="mb-16">
                        <div className="grid gap-6 sm:grid-cols-2">
                          <div className="overflow-hidden rounded-2xl">
                            <img
                              src={imgs.gallery[0]}
                              alt={`Book at ${previewBiz.businessName}`}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="rounded-2xl border border-border bg-card p-6">
                            <h3 className="mb-1 text-2xl font-bold">Make an Appointment</h3>
                            <p className="mb-5 text-sm text-muted">We&apos;ll confirm within minutes.</p>
                            <div className="space-y-3">
                              <input placeholder="Your name" className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent" />
                              <input placeholder="Phone or email" className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent" />
                              {previewServiceLines.length > 0 && (
                                <select aria-label="Select a service" className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent">
                                  <option value="">Select a service...</option>
                                  {previewServiceLines.map((line, i) => <option key={i}>{line.split(/[-$]/)[0].trim()}</option>)}
                                </select>
                              )}
                              <input placeholder="Preferred date & time" className="w-full rounded-lg border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-accent" />
                              <button className="w-full rounded-lg py-3 font-semibold text-white transition-colors hover:opacity-90" style={{ backgroundColor: imgs.accent }}>
                                Request Appointment
                              </button>
                            </div>
                          </div>
                        </div>
                      </section>

                      {/* Info cards */}
                      <section className="mb-16 grid gap-4 sm:grid-cols-3">
                        {previewBiz.hours && (
                          <div className="rounded-xl border border-border bg-card p-6">
                            <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg text-lg" style={{ backgroundColor: `${imgs.accent}20`, color: imgs.accent }}>
                              <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>
                            </div>
                            <h3 className="mb-1 font-bold">Hours</h3>
                            <p className="text-sm text-muted">{previewBiz.hours}</p>
                          </div>
                        )}
                        <div className="rounded-xl border border-border bg-card p-6">
                          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg text-lg" style={{ backgroundColor: `${imgs.accent}20`, color: imgs.accent }}>
                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M17.657 16.657L13.414 20.9a2 2 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><circle cx="12" cy="11" r="3"/></svg>
                          </div>
                          <h3 className="mb-1 font-bold">Location</h3>
                          <div className="text-sm text-muted">
                            <p>{previewBiz.location || "Location TBD"}</p>
                            {previewBiz.phone && <p className="mt-1">{previewBiz.phone}</p>}
                            {previewBiz.email && <p className="mt-1">{previewBiz.email}</p>}
                          </div>
                        </div>
                        <div className="rounded-xl border border-border bg-card p-6">
                          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg text-lg" style={{ backgroundColor: `${imgs.accent}20`, color: imgs.accent }}>
                            <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                          </div>
                          <h3 className="mb-1 font-bold">AI Assistant</h3>
                          <p className="text-sm text-muted">Chat with us 24/7 right here on the site. Make appointments, ask questions, get instant answers.</p>
                        </div>
                      </section>

                      {/* What Your AI Solves */}
                      {(previewBiz.painPoints || previewBiz.features) && (
                        <section className="mb-16">
                          <h3 className="mb-6 text-center text-2xl font-bold">What Your AI Employee Handles</h3>
                          <div className="grid gap-4 sm:grid-cols-2">
                            {previewBiz.painPoints && previewBiz.painPoints.split(",").map((point) => (
                              <div key={point} className="flex items-start gap-3 rounded-xl border border-red-500/10 bg-red-500/5 p-4">
                                <span className="mt-0.5 text-red-400">&#10007;</span>
                                <div>
                                  <div className="text-xs font-medium uppercase tracking-wide text-red-400">Problem</div>
                                  <div className="text-sm">{point.trim()}</div>
                                </div>
                              </div>
                            ))}
                            {previewBiz.features && previewBiz.features.split(",").map((feat) => (
                              <div key={feat} className="flex items-start gap-3 rounded-xl border p-4" style={{ borderColor: `${imgs.accent}20`, backgroundColor: `${imgs.accent}08` }}>
                                <span className="mt-0.5" style={{ color: imgs.accent }}>&#10003;</span>
                                <div>
                                  <div className="text-xs font-medium uppercase tracking-wide" style={{ color: imgs.accent }}>AI Solution</div>
                                  <div className="text-sm">{feat.trim()}</div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </section>
                      )}

                      {/* AI Chat bubble preview */}
                      <section className="mb-16">
                        <div className="mx-auto max-w-md rounded-2xl border bg-card p-6 shadow-lg" style={{ borderColor: `${imgs.accent}30` }}>
                          <div className="flex items-center gap-3 mb-4">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold text-white" style={{ backgroundColor: imgs.accent }}>
                              {previewBiz.businessName.charAt(0)?.toUpperCase() || "A"}
                            </div>
                            <div>
                              <div className="text-sm font-semibold">{previewBiz.businessName} AI</div>
                              <div className="flex items-center gap-1 text-xs text-green">
                                <span className="relative flex h-1.5 w-1.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green opacity-75"></span><span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green"></span></span>
                                Online 24/7
                              </div>
                            </div>
                          </div>
                          <div className="space-y-2 mb-4">
                            <div className="rounded-lg bg-background px-3 py-2 text-sm">
                              Hey! Welcome to {previewBiz.businessName}. I can help you make an appointment, answer questions about our services, or anything else. What would you like to do?
                            </div>
                            <div className="flex flex-wrap gap-1.5">
                              {["Make appointment", "See services", "Hours & location"].map((q) => (
                                <span key={q} className="rounded-full border px-2.5 py-1 text-[11px]" style={{ borderColor: `${imgs.accent}40`, color: imgs.accent }}>
                                  {q}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <input placeholder="Type a message..." disabled className="flex-1 rounded-lg border border-border bg-background px-3 py-2 text-sm opacity-60" />
                            <button disabled className="rounded-lg px-4 py-2 text-sm font-medium text-white opacity-80" style={{ backgroundColor: imgs.accent }}>Send</button>
                          </div>
                          <p className="mt-2 text-center text-xs text-muted">Fully functional on the live site — web chat, text</p>
                        </div>
                      </section>
                    </div>
                  </>
                );
              })()}

              {/* Go Live CTA */}
              <section className="rounded-2xl border-2 border-accent/30 bg-gradient-to-br from-accent/5 to-green/5 p-8 sm:p-10 text-center">
                <h3 className="mb-2 text-3xl font-bold">Like What You See?</h3>
                <p className="mx-auto mb-2 max-w-lg text-muted">
                  That took 10 seconds. The full version has a working AI assistant, appointments, CRM, and review collection — all live within 24 hours.
                </p>
                <p className="mx-auto mb-6 max-w-lg text-sm text-muted">
                  Pick a package and we&apos;ll handle everything.
                </p>

                {/* Package selector */}
                <div className="mb-6 grid gap-3 sm:grid-cols-2 text-sm">
                  {([
                    { key: "launch", name: "Launch", setup: "$500–$1,500", mo: "optional $49–$99/mo", features: ["Website + AI chat", "Mobile responsive", "Appointments"], popular: false },
                    { key: "ultra", name: "Trion Ultra", setup: "$750–$2,000", mo: "$49–$199/mo", features: ["Everything in Launch", "CRM + Reviews + Reminders", "Full AI team"], popular: true },
                  ] as const).map((pkg) => (
                    <button
                      key={pkg.key}
                      onClick={() => setSelectedPackage(pkg.key)}
                      className={`relative rounded-xl p-5 text-left transition-all ${
                        selectedPackage === pkg.key
                          ? "border-2 border-accent bg-accent/5 scale-[1.02]"
                          : "border border-border bg-card hover:border-accent/50"
                      }`}
                    >
                      {pkg.popular && (
                        <div className="absolute -top-2.5 left-1/2 -translate-x-1/2 rounded-full bg-green px-3 py-0.5 text-[10px] font-bold text-white">BEST VALUE</div>
                      )}
                      <div className="font-bold text-base">{pkg.name}</div>
                      <div className="text-accent font-semibold mt-1">{pkg.setup} + {pkg.mo}</div>
                      <ul className="mt-2 space-y-1">
                        {pkg.features.map((f, i) => (
                          <li key={i} className="flex items-start gap-1.5 text-xs text-muted">
                            <span className="text-green mt-0.5">&#10003;</span>{f}
                          </li>
                        ))}
                      </ul>
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleGoLive}
                  disabled={isSaving}
                  className="rounded-xl bg-accent px-10 py-4 text-lg font-semibold text-white transition-all hover:bg-accent-dim hover:scale-105 disabled:opacity-50"
                >
                  {isSaving ? "Submitting..." : `Go Live with ${selectedPackage.charAt(0).toUpperCase() + selectedPackage.slice(1)}`}
                </button>
                {!biz.email && (
                  <p className="mt-3 text-xs text-accent">Tell the AI your email first so we can reach you!</p>
                )}
                <p className="mt-3 text-xs text-muted">No contracts. Cancel anytime. Live in 24 hours.</p>
              </section>
            </div>
          )}
        </section>
      )}

      {/* Bottom info sections (visible even before preview) */}
      {!showPreview && (
        <>
          {/* How it works */}
          <section className="relative border-t border-border bg-card/30 px-4 py-20 overflow-hidden">
            <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_40%_at_50%_100%,var(--accent)/8%,transparent)] pointer-events-none" />
            <div className="relative mx-auto max-w-4xl">
              <h2 className="mb-12 text-center text-3xl font-bold">60 Seconds. That&apos;s It.</h2>
              <div className="grid gap-8 sm:grid-cols-4">
                {[
                  { step: "1", title: "Say your business type", desc: "Barber, nail tech, salon, trainer — I already know what you offer." },
                  { step: "2", title: "I pre-fill everything", desc: "Services, prices, hours — all suggested. You just confirm or tweak." },
                  { step: "3", title: "Your site builds instantly", desc: "Click one button. Full website with AI assistant generated in seconds." },
                  { step: "4", title: "Trion takes it live", desc: "Appointments, CRM, reviews — all connected within 24 hours." },
                ].map((item, i) => (
                  <div key={i} className="text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-accent text-lg font-bold text-white">{item.step}</div>
                    <h3 className="mb-2 font-bold">{item.title}</h3>
                    <p className="text-sm text-muted">{item.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Feedback & Reviews — we know the business, agent does it all */}
          <section className="border-t border-border bg-card/30 px-4 py-20">
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-4 text-center text-2xl font-bold">We Know Your Business</h2>
              <p className="mb-12 text-center text-muted">Trion is a universal business strategist & offer designer — paste any job/role/business and get packages + outreach. Plus 24/7 answer, appointments, log, review when your site is live.</p>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {[
                  { biz: "Barber shop", quote: "No more missed calls. Trion schedules while I cut. My calendar fills itself.", stars: 5 },
                  { biz: "Nail salon", quote: "Answers every DM about prices and hours. I just show up and do nails.", stars: 5 },
                  { biz: "Restaurant", quote: "Takes reservations 24/7. Reminds customers. Sends review requests. I run the kitchen.", stars: 5 },
                  { biz: "Contractor", quote: "Captures leads with photos. Schedules estimates. Follows up on quotes. I close more jobs.", stars: 5 },
                ].map((r, i) => (
                  <div key={i} className="rounded-xl border border-border bg-card p-5">
                    <div className="mb-2 flex gap-0.5 text-amber">
                      {Array.from({ length: r.stars }).map((_, j) => (
                        <span key={j}>★</span>
                      ))}
                    </div>
                    <p className="mb-3 text-sm leading-relaxed">&quot;{r.quote}&quot;</p>
                    <p className="text-xs font-medium text-muted">{r.biz}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* About Trion */}
          <section className="mx-auto max-w-4xl px-4 py-20">
            <div className="flex flex-col items-center gap-8 sm:flex-row">
              <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-accent to-green text-3xl font-bold text-white">T</div>
              <div>
                <h2 className="mb-2 text-2xl font-bold">About Trion Express</h2>
                <p className="mb-3 text-muted">
                  Trion Express is an AI business consultant that diagnoses what&apos;s holding your business back
                  and builds the fix — website, AI assistant, appointments, CRM, reviews — all automated.
                </p>
                <p className="text-sm text-muted">
                  Not a big tech company. One team that figured out how to make AI
                  actually useful for barber shops, nail techs, salons, contractors, and restaurants.
                </p>
              </div>
            </div>
          </section>

          {/* Data record example — what gets logged */}
          <section className="border-t border-border bg-muted/20 px-4 py-16">
            <div className="mx-auto max-w-4xl">
              <h2 className="mb-2 text-center text-2xl font-bold">What Gets Logged</h2>
              <p className="mb-8 text-center text-sm text-muted">Every appointment, lead, and review request goes into your workspace. Here&apos;s the data format.</p>
              <div className="grid gap-6 sm:grid-cols-2">
                <div className="overflow-hidden rounded-xl border border-border bg-card">
                  <div className="border-b border-border bg-muted/30 px-4 py-2 text-xs font-mono font-medium text-muted">appointments.jsonl</div>
                  <pre className="overflow-x-auto p-4 text-[11px] font-mono leading-relaxed text-muted">
{`{"name":"Maria","phone":"555-123-4567","service":"Haircut","date":"2025-03-15","time":"2:00 PM","status":"pending","created":"2025-03-11T..."}
{"name":"James","phone":"555-987-6543","service":"Beard","date":"2025-03-16","time":"10:30 AM","status":"pending","created":"2025-03-11T..."}`}
                  </pre>
                </div>
                <div className="overflow-hidden rounded-xl border border-border bg-card">
                  <div className="border-b border-border bg-muted/30 px-4 py-2 text-xs font-mono font-medium text-muted">leads.jsonl</div>
                  <pre className="overflow-x-auto p-4 text-[11px] font-mono leading-relaxed text-muted">
{`{"name":"Sarah","contact":"sarah@email.com","interest":"Interested in pricing for full set","status":"new","created":"2025-03-11T..."}
{"name":"Mike","contact":"555-555-1234","interest":"Need estimate for kitchen remodel","status":"new","created":"2025-03-11T..."}`}
                  </pre>
                </div>
              </div>
              <p className="mt-4 text-center text-xs text-muted">Your AI assistant writes directly to these files. No external CRM. No extra integrations.</p>
            </div>
          </section>

          {/* Final CTA */}
          <section className="border-t border-border px-4 py-16 text-center">
            <h2 className="mb-4 text-3xl font-bold">Ready for Trion?</h2>
            <p className="mx-auto mb-6 max-w-lg text-muted">
              Scroll back up and talk to Trion. Tell it about your business.
              Watch it diagnose, prescribe, and build — in 60 seconds.
            </p>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              className="rounded-xl bg-accent px-8 py-4 font-semibold text-white transition-all hover:bg-accent-dim hover:scale-105"
            >
              Start the Conversation
            </button>
          </section>
        </>
      )}

      {/* Trion Express intro + Services — below Meet Trion */}
      <section className="border-t border-border bg-muted/20 px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="mb-4 flex flex-wrap items-center justify-center gap-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-green/10 px-4 py-1.5 text-sm font-medium text-green">
              <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green opacity-75"></span><span className="relative inline-flex h-2 w-2 rounded-full bg-green"></span></span>
              Trion is Live
            </span>
          </div>
          <h2 className="mb-2 text-center text-2xl font-bold">Trion Express</h2>
          <p className="mb-8 text-center text-muted">
            AI Business Team — Answer, Book & Grow 24/7. I&apos;m Trion. I answer customers, make appointments, capture leads, and collect reviews — so you don&apos;t miss a sale. Barbers, salons, restaurants, contractors — any business that needs to answer customers 24/7. I run as five roles: CEO, COO, CFO, Secretary, Employee. 16 live sites built across 8 industries.
          </p>
          <div className="mb-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { icon: "🔍", title: "Universal Role Analysis", desc: "Paste any job/role/business. We extract core needs, hidden goals, pain points." },
              { icon: "📐", title: "TRION Service Model", desc: "Design outcomes as a service. Strategy, systems, coordination, reporting." },
              { icon: "📦", title: "Packages & Outreach", desc: "Fractional retainer, done-with-you, one-time setup. Pitch scripts ready." },
              { icon: "🌐", title: "Industry Agnostic", desc: "Any vertical. Tools, regulations, KPIs. One universal flow." },
              { icon: "📱", title: "24/7 Execution", desc: "Answer, appointments, log, review when your site is live." },
            ].map((s) => (
              <div key={s.title} className="rounded-xl border border-border bg-card p-4">
                <div className="mb-2 text-2xl">{s.icon}</div>
                <div className="font-semibold">{s.title}</div>
                <div className="text-sm text-muted">{s.desc}</div>
              </div>
            ))}
          </div>
          <div className="flex flex-wrap justify-center gap-3">
            <Link href="/home#services" className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium hover:border-accent hover:text-accent">Services</Link>
            <Link href="/home#sites" className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium hover:border-accent hover:text-accent">Sites</Link>
            <Link href="/home#analysis" className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium hover:border-accent hover:text-accent">Analysis</Link>
            <Link href="/home#reports" className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium hover:border-accent hover:text-accent">Reports</Link>
            <Link href="/pro-demo" className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium hover:border-accent hover:text-accent">Pro</Link>
            <Link href="/partnership" className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium hover:border-accent hover:text-accent">Partnership</Link>
            <Link href="/home" className="rounded-lg border border-border bg-card px-4 py-2 text-sm font-medium hover:border-accent hover:text-accent">Full Homepage</Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border px-4 py-8 text-center text-xs text-muted">
        <p className="flex flex-wrap items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-green/10 px-2.5 py-0.5 text-[10px] font-medium text-green">
            <span className="relative flex h-1.5 w-1.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green opacity-75"></span><span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-green"></span></span>
            Trion is Live
          </span>
          <span>Trion Express &middot; Sacramento, CA</span>
        </p>
        <div className="mt-3 flex justify-center gap-4">
          <Link href="/pitch" className="hover:text-foreground">Meet Trion</Link>
          <Link href="/try" className="hover:text-foreground">Build Manually</Link>
        </div>
      </footer>
    </div>
  );
}

function InputRow({
  label,
  value,
  onChange,
  placeholder,
  textarea,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  textarea?: boolean;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs font-medium text-muted">{label}</label>
      {textarea ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          rows={2}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-accent"
        />
      ) : (
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm outline-none transition-colors focus:border-accent"
        />
      )}
    </div>
  );
}
