export interface AgentRole {
  title: string;
  thinks: string;
  does: string[];
}

export interface IndustryProfile {
  category: string;
  keywords: string[];
  services: string[];
  painPoints: string[];
  aiSolves: string[];
  workflows: string[];
  metrics: string[];
  hours: string;
  accent: string;
  hero: string;
  gallery: string[];
  roles?: AgentRole[];
}

export const TRION_ROLES: Record<string, { title: string; icon: string; color: string; universal: string }> = {
  ceo: {
    title: "CEO — Strategic Vision",
    icon: "👔",
    color: "#6366f1",
    universal: "Sees the big picture. Tracks revenue, growth rate, customer lifetime value. Identifies the #1 bottleneck and prioritizes what to fix first. Thinks in quarters, not days.",
  },
  coo: {
    title: "COO — Operations",
    icon: "⚙️",
    color: "#f59e0b",
    universal: "Runs the machine. Every booking, order, lead, and follow-up flows through the COO brain. Eliminates manual steps, prevents double-bookings, ensures nothing falls through cracks.",
  },
  cfo: {
    title: "CFO — Revenue & Cost",
    icon: "📊",
    color: "#22c55e",
    universal: "Watches the money. Tracks average ticket size, upsell rate, cost per lead, monthly recurring revenue. Knows when to raise prices, when to discount, and when to bundle.",
  },
  secretary: {
    title: "Secretary — Communication",
    icon: "📱",
    color: "#0ea5e9",
    universal: "First point of contact. Answers every call, text, DM, and email instantly. Handles scheduling, confirmations, reminders, and follow-ups. Never sleeps.",
  },
  employee: {
    title: "Employee — Execution",
    icon: "🔨",
    color: "#ef4444",
    universal: "Gets the work done. Fills out intake forms, collects documents, generates quotes, sends invoices, writes social posts, requests reviews. Does 100 tasks you used to do manually.",
  },
};

function getRolesForIndustry(category: string, key: string): AgentRole[] {
  const roleMap: Record<string, AgentRole[]> = {
    Service: [
      { title: "CEO", thinks: "How do I fill every slot, raise my average ticket, and grow from 1 chair to 3?", does: ["Track bookings per week and revenue trend", "Identify your most profitable service and push it", "Spot slow days and trigger promotions to fill them", "Plan expansion: when to hire, when to raise prices"] },
      { title: "COO", thinks: "Every minute of the schedule should be optimized. Zero gaps, zero double-books.", does: ["Auto-schedule appointments with smart time-slot management", "Route walk-ins to open slots without disrupting booked clients", "Enforce cancellation policies automatically", "Manage waitlists and fill cancelled slots instantly"] },
      { title: "CFO", thinks: "Am I charging enough? What's my real cost per client?", does: ["Track average ticket size and flag when to upsell", "Calculate cost per acquisition from each marketing channel", "Monitor no-show rate and its revenue impact", "Suggest package deals that increase spend per visit"] },
      { title: "Secretary", thinks: "No message goes unanswered. No call goes to voicemail. Ever.", does: ["Answer text, web chat, and Instagram DMs 24/7", "Send booking confirmations and 24hr reminders", "Handle rescheduling without the owner touching the phone", "Collect contact info from every inquiry for follow-up"] },
      { title: "Employee", thinks: "What repetitive tasks is the owner doing that I can eliminate?", does: ["Send Google review requests after every appointment", "Post before/after photos to social media on schedule", "Collect new client intake info before they arrive", "Follow up with no-shows and offer rebooking"] },
    ],
    "Food & Beverage": [
      { title: "CEO", thinks: "How do I increase table turnover, boost check average, and build a loyal customer base?", does: ["Track covers per night and revenue per table", "Identify peak vs dead hours for staffing and promos", "Monitor review trends and customer sentiment", "Plan menu pricing strategy based on food cost data"] },
      { title: "COO", thinks: "Kitchen, front of house, delivery — all need to flow without bottlenecks.", does: ["Manage reservations with smart table assignment", "Handle takeout/delivery orders without tying up the phone", "Coordinate catering and private event logistics", "Track wait times and optimize seating flow"] },
      { title: "CFO", thinks: "Food cost, labor cost, and waste — where's the margin?", does: ["Track average check size and trends", "Monitor online ordering revenue vs dine-in", "Calculate loyalty program ROI", "Flag slow-moving menu items for promotion or removal"] },
      { title: "Secretary", thinks: "Every reservation request, takeout order, and complaint gets handled fast.", does: ["Take reservations via text and web 24/7", "Process takeout and delivery orders automatically", "Respond to every Google/Yelp review within hours", "Send reservation reminders and collect feedback after visits"] },
      { title: "Employee", thinks: "Guests should have a seamless experience from booking to leaving a review.", does: ["Send menu and specials to customers who inquire", "Manage waitlist during peak hours with text updates", "Process gift card purchases online", "Run 'We miss you' campaigns for lapsed customers"] },
    ],
    "Home Services": [
      { title: "CEO", thinks: "How do I close more estimates, build recurring revenue, and scale my crew?", does: ["Track estimate-to-close rate and identify why you lose jobs", "Build recurring maintenance plan revenue for stable income", "Analyze which services have the highest margin", "Plan crew expansion based on lead volume data"] },
      { title: "COO", thinks: "Leads come in, get quoted, get scheduled, get completed, get reviewed. No leaks.", does: ["Capture every lead with full project details and photos", "Route emergency calls for immediate dispatch", "Schedule estimates and jobs around crew availability", "Track job status from inquiry through completion"] },
      { title: "CFO", thinks: "Am I pricing jobs right? What's my cost per lead?", does: ["Calculate average job value and profit margin by service type", "Track marketing ROI: which channels bring the best leads", "Monitor seasonal revenue patterns for cash flow planning", "Analyze competitor pricing in your service area"] },
      { title: "Secretary", thinks: "Homeowners expect fast responses. If I don't answer in 5 minutes, they call someone else.", does: ["Answer inquiries 24/7 — even at 2am for emergencies", "Collect property details, photos, and project scope instantly", "Schedule estimates and send confirmations", "Follow up on outstanding estimates that haven't been accepted"] },
      { title: "Employee", thinks: "Paperwork, follow-ups, and reminders shouldn't require the owner's time.", does: ["Send maintenance plan renewal reminders automatically", "Request Google reviews after every completed job", "Follow up 30/60/90 days after big projects for referrals", "Generate seasonal campaigns: spring cleanups, winter prep, etc."] },
    ],
    Retail: [
      { title: "CEO", thinks: "How do I drive more traffic, increase basket size, and build lifetime value?", does: ["Track revenue per customer and repeat purchase rate", "Identify top-selling products and optimize inventory", "Build loyalty program strategy for retention", "Plan seasonal promotions and new product launches"] },
      { title: "COO", thinks: "Inventory, orders, and customer experience need to run like clockwork.", does: ["Track inventory levels and flag low-stock items", "Process online orders and coordinate fulfillment", "Manage returns and exchanges efficiently", "Sync in-store and online inventory"] },
      { title: "CFO", thinks: "What's my margin per product? Where am I losing money?", does: ["Track average transaction value and basket size", "Calculate customer acquisition cost per channel", "Monitor return rate and its impact on profitability", "Analyze seasonal demand for purchasing decisions"] },
      { title: "Secretary", thinks: "Customers asking 'do you have this?' should get an instant answer.", does: ["Answer stock and availability questions 24/7", "Send new arrival notifications to interested customers", "Handle order status inquiries", "Collect customer preferences for personalized outreach"] },
      { title: "Employee", thinks: "Every customer interaction is an opportunity to build loyalty.", does: ["Send abandoned cart recovery messages", "Run loyalty program: points, rewards, VIP tiers", "Create social media content featuring new products", "Request reviews after purchase and handle feedback"] },
    ],
    "Professional Services": [
      { title: "CEO", thinks: "How do I attract higher-value clients and build a referral machine?", does: ["Track client lifetime value and acquisition cost", "Identify most profitable practice areas or service lines", "Build referral network with automated tracking", "Plan capacity: when to hire, when to raise rates"] },
      { title: "COO", thinks: "Client intake, document collection, and case management shouldn't leak.", does: ["Automate client intake with smart screening questions", "Collect and track all required documents and forms", "Manage appointment scheduling across multiple professionals", "Track deadlines and send alerts for important dates"] },
      { title: "CFO", thinks: "Billable hours, retainers, and collection rate — every dollar matters.", does: ["Track billable utilization rate per professional", "Monitor accounts receivable and flag overdue payments", "Analyze revenue by service type and client segment", "Forecast seasonal demand (tax season, etc.)"] },
      { title: "Secretary", thinks: "Potential clients who call after hours hired someone else by morning.", does: ["Qualify leads 24/7 with intake screening and priority scoring", "Schedule consultations and send preparation materials", "Send deadline reminders for taxes, renewals, filings", "Follow up with potential clients who inquired but didn't retain"] },
      { title: "Employee", thinks: "Admin work shouldn't eat into billable time.", does: ["Send document checklists and track completion", "Generate client communication templates", "Run drip campaigns for long-term leads who aren't ready yet", "Collect testimonials and request referrals post-engagement"] },
    ],
    Healthcare: [
      { title: "CEO", thinks: "How do I improve patient retention, fill the schedule, and grow the practice?", does: ["Track patient recall rate and reactivation opportunity", "Identify highest-revenue procedures for marketing focus", "Monitor new patient acquisition and referral sources", "Plan expansion: operatories, providers, hours"] },
      { title: "COO", thinks: "Patient flow from intake to checkout should be seamless.", does: ["Manage multi-provider scheduling with service duration awareness", "Coordinate patient intake forms before arrival", "Handle insurance verification questions automatically", "Track treatment plan completion rates"] },
      { title: "CFO", thinks: "Production per chair, collection rate, overhead ratio.", does: ["Track production per provider and per procedure", "Monitor insurance vs cash-pay mix", "Analyze patient lifetime value", "Identify underperforming time blocks for targeted campaigns"] },
      { title: "Secretary", thinks: "Patients avoid calling the dentist/doctor. Make it effortless to book.", does: ["Schedule and reschedule appointments 24/7 via text/web", "Send recall reminders: '6-month cleaning due!'", "Answer insurance and FAQ questions automatically", "Send digital intake forms before first visit"] },
      { title: "Employee", thinks: "Manual reminder calls and paper forms are relics.", does: ["Send appointment reminders via text with confirm/reschedule links", "Collect patient satisfaction surveys after visits", "Request Google reviews from satisfied patients", "Run seasonal campaigns: back-to-school exams, teeth whitening specials"] },
    ],
    Manufacturing: [
      { title: "CEO", thinks: "How do I reduce RFQ response time, increase order volume, and find new verticals?", does: ["Track quote-to-order conversion and average order value", "Identify most profitable product lines and customers", "Analyze capacity utilization and plan for growth", "Research new industries to sell into"] },
      { title: "COO", thinks: "From RFQ to shipment, every step needs to be tracked.", does: ["Collect complete RFQ details instantly: specs, material, quantity, timeline", "Provide real-time order status updates to customers", "Set quality checkpoint reminders at each production stage", "Manage rush orders without disrupting existing schedule"] },
      { title: "CFO", thinks: "Material costs, machine time, labor — is our quoting profitable?", does: ["Track actual vs quoted costs per job for pricing accuracy", "Monitor on-time delivery rate and its impact on retention", "Analyze customer profitability: who's worth keeping, who's costing money", "Forecast material needs based on order pipeline"] },
      { title: "Secretary", thinks: "Customers want instant updates. 'Where's my order?' shouldn't require a phone call.", does: ["Answer order status inquiries 24/7 without shop floor interruption", "Collect RFQ submissions with file uploads and specifications", "Send proofing approvals and revision requests", "Follow up on quotes that haven't been accepted"] },
      { title: "Employee", thinks: "Administrative bottlenecks slow down production.", does: ["Generate quotes from standardized templates based on specs", "Send reorder reminders to repeat customers", "Create capability sheets and case studies for marketing", "Process file uploads with format validation guidelines"] },
    ],
    Events: [
      { title: "CEO", thinks: "How do I book more high-value events and build a referral pipeline?", does: ["Track average event value and booking conversion rate", "Identify most profitable event types for marketing focus", "Build vendor partnerships that drive mutual referrals", "Plan seasonal capacity: wedding season, holiday parties, corporate Q4"] },
      { title: "COO", thinks: "Multiple events, multiple vendors, multiple timelines — nothing can slip.", does: ["Check date availability instantly against master calendar", "Coordinate vendor timelines and send prep reminders", "Manage event day logistics and contact sheets", "Track deposits, balances, and payment milestones"] },
      { title: "CFO", thinks: "Event pricing has to cover costs and leave real margin.", does: ["Track profitability per event type", "Monitor deposit collection rate and payment timing", "Calculate vendor costs vs client pricing for each event", "Forecast revenue based on booking pipeline"] },
      { title: "Secretary", thinks: "Leads ask for date availability — slow response = lost booking.", does: ["Respond to event inquiries with availability and ballpark pricing instantly", "Collect event details: type, guest count, preferences, budget", "Schedule consultations and send follow-up proposals", "Send thank-you messages and request reviews after events"] },
      { title: "Employee", thinks: "Proposals, contracts, and follow-ups shouldn't take days.", does: ["Generate event proposals from templates based on client details", "Send and track contracts and deposit invoices", "Post event photos to social media and tag clients", "Run '1-year anniversary' campaigns for repeat bookings"] },
    ],
    Education: [
      { title: "CEO", thinks: "How do I increase enrollment, retention, and revenue per student?", does: ["Track enrollment pipeline and conversion from trial to paid", "Identify highest-demand programs for expansion", "Monitor student retention and reasons for dropout", "Plan seasonal: summer camps, back-to-school, holiday programs"] },
      { title: "COO", thinks: "Class schedules, instructor availability, and room assignments must be optimized.", does: ["Manage class scheduling across multiple instructors and rooms", "Handle enrollment and waitlist management", "Track attendance and flag disengaged students", "Coordinate makeup classes and schedule changes"] },
      { title: "CFO", thinks: "Revenue per student, instructor costs, and facility utilization.", does: ["Track revenue per program and per student", "Monitor class fill rates and underperforming programs", "Calculate instructor cost vs revenue per class", "Forecast seasonal enrollment patterns"] },
      { title: "Secretary", thinks: "Parents call during class time. By the time you call back, they've enrolled elsewhere.", does: ["Handle enrollment inquiries and schedule trial lessons 24/7", "Send class reminders to parents and students", "Communicate schedule changes and cancellations", "Collect registration forms and payment before first class"] },
      { title: "Employee", thinks: "Progress communication and engagement keep students enrolled.", does: ["Send progress reports to parents after milestones", "Request reviews and testimonials from satisfied families", "Run seasonal enrollment campaigns and referral programs", "Post student achievements and class highlights to social media"] },
    ],
    Automotive: [
      { title: "CEO", thinks: "How do I build trust, increase repair ticket value, and create recurring revenue?", does: ["Track average repair ticket and customer return rate", "Build maintenance plan program for recurring revenue", "Monitor Google rating and competitive positioning", "Identify most profitable service types for marketing"] },
      { title: "COO", thinks: "Diagnostics, parts ordering, repair scheduling — all must flow.", does: ["Triage customer symptoms to estimate job complexity", "Schedule repairs around bay availability and parts delivery", "Track job status from intake to completion", "Manage parts ordering and delivery coordination"] },
      { title: "CFO", thinks: "Parts markup, labor rate, and warranty claims — protect the margin.", does: ["Track profitability per service type", "Monitor labor efficiency: quoted hours vs actual", "Analyze warranty and comeback rates", "Calculate customer lifetime value for service vs one-time"] },
      { title: "Secretary", thinks: "Customers hear a noise and panic. Instant response builds trust.", does: ["AI symptom checker: 'Describe the noise' → suggests urgency level", "Book appointments 24/7 while mechanics work", "Send service reminders based on mileage/time intervals", "Handle estimate approvals and part delay communications"] },
      { title: "Employee", thinks: "Service reminders and review collection generate repeat business.", does: ["Send oil change/tire rotation reminders based on service history", "Request Google reviews after completed repairs", "Follow up on declined services: 'Your brakes were at 30% — time to schedule?'", "Create maintenance packages for seasonal upsells"] },
    ],
    "Tech & Digital": [
      { title: "CEO", thinks: "How do I attract bigger retainers, reduce churn, and scale without more staff?", does: ["Track monthly recurring revenue and client retention rate", "Identify which service lines generate the most profit", "Build upsell path: SEO → PPC → full retainer → consulting", "Plan capacity to take on more clients without burning out"] },
      { title: "COO", thinks: "Client onboarding, deliverables, and reporting need to be systematized.", does: ["Streamline client onboarding with automated asset collection", "Track project deliverables and flag scope creep", "Generate monthly performance reports automatically", "Manage multi-client timelines and deadlines"] },
      { title: "CFO", thinks: "Time spent vs retainer value — are all clients profitable?", does: ["Track profitability per client: retainer vs actual time spent", "Monitor scope creep impact on margin", "Calculate cost per lead for your own business development", "Forecast revenue and capacity utilization"] },
      { title: "Secretary", thinks: "Agency leads want fast, impressive responses that prove capability.", does: ["Qualify inbound leads: budget, timeline, goals, decision maker", "Schedule discovery calls and send pre-meeting questionnaires", "Handle client communication for status updates", "Follow up with proposals that haven't been signed"] },
      { title: "Employee", thinks: "Reports, proposals, and routine communication shouldn't eat billable hours.", does: ["Generate monthly client reports with key metrics and insights", "Create proposals from templates based on discovery call data", "Run case study creation from completed projects", "Post thought leadership content on schedule"] },
    ],
  };

  return roleMap[category] || roleMap.Service || [];
}


export const INDUSTRIES: Record<string, IndustryProfile> = {

  // ─── SERVICE / APPOINTMENT-BASED ──────────────────────────────────

  barber: {
    category: "Service",
    keywords: ["barber", "barbershop", "barber shop", "fade", "haircut"],
    services: [
      "Haircut - $30", "Skin Fade - $35", "Beard Trim - $15", "Kids Cut - $20",
      "Hot Towel Shave - $25", "Lineup - $15", "Hair Design - $40", "Beard Shape-Up - $20",
    ],
    painPoints: [
      "Missing calls while cutting hair — every missed call is a lost customer",
      "No-shows waste a 30-minute slot that could have been filled",
      "Relying on walk-ins and word-of-mouth with no online presence",
      "Can't collect Google reviews consistently",
    ],
    aiSolves: [
      "Auto-booking via text/web so clients book while you cut",
      "Reminder texts 24hrs before — reduces no-shows by 40%",
      "Google review requests sent after every appointment",
      "Website makes you findable on Google Search and Maps",
      "AI answers questions about services/prices/hours 24/7",
    ],
    workflows: ["booking", "reminders", "reviews", "lead-capture", "website", "social"],
    metrics: ["Bookings per week", "No-show rate", "Google rating", "New clients/month"],
    hours: "Mon-Sat 9am-7pm, Sun Closed",
    accent: "#d4a574",
    hero: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1585747860019-8e81b0d5fe30?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=600&q=80",
    ],
  },

  nail: {
    category: "Service",
    keywords: ["nail", "nail tech", "nail salon", "manicure", "pedicure", "nails"],
    services: [
      "Manicure - $25", "Pedicure - $35", "Gel Nails - $45", "Acrylic Full Set - $55",
      "Nail Art - $10+", "Fill-In - $35", "Dip Powder - $40", "Gel Removal - $15",
    ],
    painPoints: [
      "Clients DM on Instagram but never actually book",
      "Double-bookings from managing scheduling manually",
      "No way to showcase nail art portfolio online",
      "Spending hours texting clients back and forth to confirm times",
    ],
    aiSolves: [
      "AI responds to Instagram DMs and text instantly with booking links",
      "Online booking prevents double-books and fills empty slots",
      "Website showcases nail art portfolio with before/after gallery",
      "Auto-reminders and confirmations eliminate back-and-forth texting",
    ],
    workflows: ["booking", "reminders", "reviews", "portfolio", "social", "lead-capture"],
    metrics: ["Bookings per week", "Instagram-to-booking conversion", "Repeat client rate", "Google rating"],
    hours: "Mon-Sat 9:30am-7pm, Sun 11am-5pm",
    accent: "#e8a0bf",
    hero: "https://images.unsplash.com/photo-1604654894610-df63bc536371?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1632345031435-8727f6897d53?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1610992015732-2449b76344bc?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1595521624992-48a59aef95e3?auto=format&fit=crop&w=600&q=80",
    ],
  },

  hair: {
    category: "Service",
    keywords: ["hair salon", "hair stylist", "salon", "hairdresser", "colorist"],
    services: [
      "Women's Cut - $50", "Men's Cut - $30", "Blowout - $40", "Color - $85+",
      "Highlights - $120+", "Balayage - $150+", "Deep Conditioning - $35", "Keratin Treatment - $200+",
    ],
    painPoints: [
      "Complex scheduling — different services take different times",
      "Stylists too busy cutting to answer phones",
      "New clients can't find you on Google",
      "No consistent review collection system",
    ],
    aiSolves: [
      "Smart booking knows service durations and prevents overbooking",
      "AI explains services and pricing so stylists focus on clients",
      "Website with SEO brings in Google traffic from local searches",
      "Automatic review requests build and maintain your Google rating",
    ],
    workflows: ["booking", "reminders", "reviews", "lead-capture", "website", "social"],
    metrics: ["Chair utilization rate", "New client acquisition", "Google rating", "Average ticket size"],
    hours: "Tue-Sat 9am-7pm, Sun-Mon Closed",
    accent: "#c084fc",
    hero: "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=600&q=80",
    ],
  },

  lash: {
    category: "Service",
    keywords: ["lash", "lash tech", "brow", "lash extensions", "brow lamination", "esthetician"],
    services: [
      "Classic Lash Set - $120", "Volume Set - $160", "Hybrid Set - $140", "Lash Fill - $65",
      "Brow Wax - $20", "Brow Tint - $25", "Brow Lamination - $55", "Lash Lift - $75",
    ],
    painPoints: [
      "No-shows block 1-2 hour slots that can't be filled last-minute",
      "Clients ask the same aftercare questions over and over",
      "Appointment-only business but hard to manage bookings solo",
      "No before/after portfolio to attract new clients",
    ],
    aiSolves: [
      "Auto-booking with deposit collection reduces no-shows",
      "AI handles aftercare FAQ automatically — saves hours per week",
      "Reminder texts 24hrs before with cancellation policy",
      "Website shows before/after gallery that converts browsers to bookings",
    ],
    workflows: ["booking", "reminders", "reviews", "faq", "portfolio", "lead-capture"],
    metrics: ["No-show rate", "Fill rate", "Portfolio engagement", "Repeat client percentage"],
    hours: "Mon-Sat 10am-6pm",
    accent: "#f9a8d4",
    hero: "https://images.unsplash.com/photo-1583001931096-959e9a1a6223?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1516914589923-f105f1535f88?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1588359348347-9bc6cbbb689e?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1594037918498-52ce9b8d5a42?auto=format&fit=crop&w=600&q=80",
    ],
  },

  massage: {
    category: "Service",
    keywords: ["massage", "spa", "massage therapist", "wellness", "day spa", "medspa"],
    services: [
      "Swedish Massage 60min - $80", "Deep Tissue 60min - $95", "Hot Stone - $110",
      "Facial - $75", "Body Scrub - $85", "Couples Massage - $170", "Prenatal Massage - $85",
    ],
    painPoints: [
      "Therapists can't answer phones during sessions — missed bookings",
      "Last-minute cancellations leave expensive empty slots",
      "Hard to upsell add-ons and packages",
      "No gift certificate system online",
    ],
    aiSolves: [
      "AI books appointments while therapists work — no missed calls ever",
      "Auto-fill cancellation slots from waitlist instantly",
      "AI suggests add-ons and upgrades during the booking conversation",
      "Website enables online gift certificate purchases 24/7",
    ],
    workflows: ["booking", "reminders", "reviews", "upsell", "waitlist", "gift-cards"],
    metrics: ["Room utilization", "Average ticket with upsells", "Cancellation rate", "Gift card revenue"],
    hours: "Mon-Sun 9am-8pm",
    accent: "#86efac",
    hero: "https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600334129128-685c5582fd35?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1519823551278-64ac92734fb1?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1540555700478-4be289fbec6d?auto=format&fit=crop&w=600&q=80",
    ],
  },

  tattoo: {
    category: "Service",
    keywords: ["tattoo", "tattoo artist", "piercing", "tattoo shop", "ink", "body art"],
    services: [
      "Small Tattoo - $80+", "Medium Tattoo - $200+", "Large Tattoo - $500+",
      "Custom Design - $100/hr", "Touch-Up - $50+", "Ear Piercing - $30",
      "Nose Piercing - $40", "Consultation - Free",
    ],
    painPoints: [
      "Design consultations take time but don't always convert to bookings",
      "Deposits get complicated to track manually",
      "Portfolio is scattered across Instagram with no central showcase",
      "Clients ghost after initial inquiry",
    ],
    aiSolves: [
      "AI qualifies design requests and collects references before consultation",
      "Automated deposit collection and tracking with reminders",
      "Professional portfolio website with style categories and search",
      "Auto follow-up with leads who inquired but didn't book",
    ],
    workflows: ["booking", "deposits", "portfolio", "lead-capture", "follow-up", "reviews"],
    metrics: ["Consultation-to-booking rate", "Deposit collection rate", "Portfolio views", "Repeat clients"],
    hours: "Tue-Sat 11am-8pm, Sun-Mon Closed",
    accent: "#a78bfa",
    hero: "https://images.unsplash.com/photo-1598371839696-5c5bb1c12015?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1611501275019-9b5cda994e8d?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1590246814883-57c511c5b868?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1562962230-16e4623d36e6?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1565058379802-bbe93b2f703a?auto=format&fit=crop&w=600&q=80",
    ],
  },

  fitness: {
    category: "Service",
    keywords: ["trainer", "personal trainer", "gym", "fitness", "crossfit", "yoga", "pilates"],
    services: [
      "Personal Training 1hr - $60", "Group Class - $20", "Monthly Membership - $50",
      "10-Session Pack - $500", "Nutrition Plan - $100", "Online Coaching - $150/mo",
    ],
    painPoints: [
      "Last-minute cancellations leave empty sessions",
      "Hard to manage different membership types and packages",
      "Leads inquire but don't sign up — no follow-up system",
      "Client accountability drops without regular check-ins",
    ],
    aiSolves: [
      "Cancellation policy enforced automatically by AI",
      "Membership and package management — tracks sessions, renewals, expirations",
      "AI follows up with leads who didn't convert within 48hrs",
      "Automated check-in reminders and progress messages keep clients engaged",
    ],
    workflows: ["booking", "memberships", "lead-capture", "follow-up", "reminders", "progress-tracking"],
    metrics: ["Client retention rate", "Session utilization", "Lead conversion", "Monthly recurring revenue"],
    hours: "Mon-Fri 5am-9pm, Sat-Sun 7am-5pm",
    accent: "#fb923c",
    hero: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=600&q=80",
    ],
  },

  pet: {
    category: "Service",
    keywords: ["pet", "pet grooming", "groomer", "dog grooming", "dog", "vet", "veterinary", "animal"],
    services: [
      "Bath & Brush - $40", "Full Groom - $65", "Nail Trim - $15",
      "Teeth Brushing - $10", "De-shedding Treatment - $50", "Puppy First Groom - $45",
    ],
    painPoints: [
      "Owners call during grooming sessions — can't answer with wet dogs",
      "Different breeds need different services — confusing for new clients",
      "Seasonal demand spikes overwhelm manual scheduling",
      "Hard to remember pet details and preferences between visits",
    ],
    aiSolves: [
      "AI answers breed-specific questions and recommends the right service",
      "Online booking with pet profiles — breed, size, temperament saved",
      "Automated waitlist management during peak seasons",
      "Reminder texts with pet name for a personal touch",
    ],
    workflows: ["booking", "reminders", "reviews", "pet-profiles", "seasonal-waitlist", "lead-capture"],
    metrics: ["Bookings per week", "Repeat client rate", "Average ticket", "Google rating"],
    hours: "Mon-Sat 8am-5pm",
    accent: "#f97316",
    hero: "https://images.unsplash.com/photo-1516734212186-a967f81ad0d7?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1583337130417-13571f38b823?auto=format&fit=crop&w=600&q=80",
    ],
  },

  photography: {
    category: "Service",
    keywords: ["photographer", "photography", "videographer", "video", "studio", "photo"],
    services: [
      "Portrait Session - $150", "Event Coverage - $500+", "Wedding Package - $2000+",
      "Headshots - $100", "Product Photography - $200+", "Photo Editing - $50/hr",
    ],
    painPoints: [
      "Inquiries come in but clients ghost after the first message",
      "Pricing conversations are repetitive and time-consuming",
      "Portfolio is only on Instagram — no professional web presence",
      "Contract and deposit management is manual and messy",
    ],
    aiSolves: [
      "AI qualifies leads instantly — budget, date, style — and books consultations",
      "Automated pricing breakdowns based on package selected",
      "Professional portfolio website with galleries organized by category",
      "Follow-up sequences for leads who didn't book within 48 hours",
    ],
    workflows: ["lead-capture", "quoting", "booking", "portfolio", "follow-up", "contracts"],
    metrics: ["Inquiry-to-booking rate", "Average booking value", "Portfolio views", "Repeat clients"],
    hours: "By appointment",
    accent: "#6d5cfc",
    hero: "https://images.unsplash.com/photo-1554048612-b6a482bc67e5?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1542038784456-1ea8e935640e?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1471341971476-ae15ff5dd4ea?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1606916148390-2711d28e88a9?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1520390138845-fd2d229dd553?auto=format&fit=crop&w=600&q=80",
    ],
  },

  // ─── FOOD & BEVERAGE ──────────────────────────────────────────────

  restaurant: {
    category: "Food & Beverage",
    keywords: ["restaurant", "cafe", "diner", "bistro", "eatery", "food truck", "bakery", "catering", "bar", "pub"],
    services: [
      "Dine-In", "Takeout & Delivery", "Catering", "Private Events",
      "Online Ordering", "Gift Cards", "Loyalty Program",
    ],
    painPoints: [
      "Phone rings nonstop during rush — can't answer while cooking/serving",
      "Reservation no-shows waste tables during peak hours",
      "Takeout orders get lost or confused over the phone",
      "Bad Yelp/Google reviews go unanswered and tank reputation",
    ],
    aiSolves: [
      "AI handles reservations and takeout orders via text/web 24/7",
      "Reminder texts for reservations reduce no-shows by 35%",
      "AI responds to every review — good and bad — within hours",
      "Full menu on website with online ordering integration",
      "Automated follow-up: 'How was your meal?' drives 5-star reviews",
    ],
    workflows: ["reservations", "ordering", "reviews", "menu-management", "events", "loyalty"],
    metrics: ["Table turnover rate", "Online order volume", "Review response rate", "No-show rate"],
    hours: "Mon-Sun 11am-10pm",
    accent: "#ef4444",
    hero: "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1466978913421-dad2ebd01d17?auto=format&fit=crop&w=600&q=80",
    ],
  },

  // ─── HOME SERVICES / TRADES ───────────────────────────────────────

  contractor: {
    category: "Home Services",
    keywords: ["contractor", "general contractor", "gc", "builder", "construction", "remodel", "renovation"],
    services: [
      "Free Estimates", "Kitchen Remodel", "Bathroom Remodel", "Room Addition",
      "Flooring", "Painting", "Roofing", "General Repairs",
    ],
    painPoints: [
      "Missing calls on job sites — leads go to the next contractor",
      "Slow follow-up on estimates loses jobs to faster competitors",
      "No professional web presence to show past work and credibility",
      "Managing multiple project inquiries at different stages is chaotic",
    ],
    aiSolves: [
      "AI captures leads instantly 24/7 — name, project type, address, photos",
      "Automated follow-up within 1 hour of inquiry with next steps",
      "Website showcases portfolio of completed projects with before/after photos",
      "Lead pipeline tracking — inquiry → estimate → signed → in progress → complete",
    ],
    workflows: ["lead-capture", "quoting", "follow-up", "portfolio", "project-pipeline", "reviews"],
    metrics: ["Lead response time", "Estimate-to-close rate", "Average project value", "Google rating"],
    hours: "Mon-Fri 7am-5pm, Sat by appointment",
    accent: "#f59e0b",
    hero: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1523413363574-c30aa1c2a516?auto=format&fit=crop&w=600&q=80",
    ],
  },

  plumber: {
    category: "Home Services",
    keywords: ["plumber", "plumbing", "pipe", "drain", "water heater", "sewer"],
    services: [
      "Drain Cleaning - $150+", "Leak Repair - $200+", "Water Heater Install - $800+",
      "Toilet Repair - $120+", "Sewer Line - $300+", "Emergency Service - $250+", "Free Estimates",
    ],
    painPoints: [
      "Emergency calls come at all hours — can't always answer",
      "Customers want instant quotes but jobs vary wildly",
      "Competing with big franchise plumbers who have better SEO",
      "No system to follow up after a job for reviews or referrals",
    ],
    aiSolves: [
      "AI answers 24/7 — qualifies emergencies vs. standard jobs, collects address and photos",
      "Smart quoting: AI gives ranges based on issue type, schedules estimate for exact pricing",
      "Local SEO website with service pages that rank for '[city] plumber'",
      "Automated review request after job completion + referral program prompts",
    ],
    workflows: ["lead-capture", "emergency-triage", "quoting", "scheduling", "reviews", "follow-up"],
    metrics: ["Emergency response time", "Quote-to-close rate", "Google ranking", "Revenue per job"],
    hours: "Mon-Fri 7am-6pm, Emergency 24/7",
    accent: "#3b82f6",
    hero: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1607472586893-edb57bdc0e39?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80",
    ],
  },

  electrician: {
    category: "Home Services",
    keywords: ["electrician", "electrical", "wiring", "panel", "lighting"],
    services: [
      "Outlet/Switch Install - $150+", "Panel Upgrade - $1500+", "Lighting Install - $200+",
      "Ceiling Fan Install - $175+", "Rewiring - $3000+", "EV Charger Install - $800+",
      "Emergency Service - $250+", "Inspection - $200",
    ],
    painPoints: [
      "Customers don't know if their issue is urgent or can wait",
      "Hard to explain pricing without seeing the job first",
      "Missing calls while on ladder or in crawl space",
      "Big companies dominate Google — hard to compete locally",
    ],
    aiSolves: [
      "AI triages issues: 'Is this sparking? Burning smell? That's an emergency — dispatching now'",
      "Collects photos/video of the issue so you can pre-quote before arrival",
      "24/7 lead capture with intelligent scheduling around your workload",
      "SEO-optimized website targeting '[city] electrician' + all service types",
    ],
    workflows: ["lead-capture", "emergency-triage", "quoting", "scheduling", "reviews", "follow-up"],
    metrics: ["Lead response time", "Close rate", "Average job value", "Google visibility"],
    hours: "Mon-Fri 7am-6pm, Emergency 24/7",
    accent: "#eab308",
    hero: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1523413363574-c30aa1c2a516?auto=format&fit=crop&w=600&q=80",
    ],
  },

  hvac: {
    category: "Home Services",
    keywords: ["hvac", "heating", "cooling", "air conditioning", "ac", "furnace", "heat pump"],
    services: [
      "AC Repair - $150+", "Furnace Repair - $200+", "System Install - $3000+",
      "Maintenance Plan - $200/yr", "Duct Cleaning - $300+", "Thermostat Install - $150+",
      "Emergency Service - $250+",
    ],
    painPoints: [
      "Summer/winter spikes overwhelm the phone — missed calls = lost revenue",
      "Maintenance plan renewals fall through the cracks",
      "Customers wait until emergency to call — no proactive reminders",
      "Hard to upsell maintenance plans after one-time repairs",
    ],
    aiSolves: [
      "AI handles call overflow during peak seasons — qualifies and schedules",
      "Automated maintenance plan renewal reminders with easy re-enrollment",
      "Seasonal check-up reminders: 'AC tune-up before summer' drives repeat business",
      "Post-repair follow-up pitches maintenance plan with cost savings breakdown",
    ],
    workflows: ["lead-capture", "emergency-triage", "scheduling", "maintenance-plans", "seasonal-campaigns", "reviews"],
    metrics: ["Calls handled during peak", "Maintenance plan retention", "Emergency response time", "Revenue per customer"],
    hours: "Mon-Fri 7am-6pm, Emergency 24/7",
    accent: "#06b6d4",
    hero: "https://images.unsplash.com/photo-1585704032915-c3400ca199e7?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80",
    ],
  },

  landscaping: {
    category: "Home Services",
    keywords: ["landscaping", "landscaper", "lawn", "lawn care", "yard", "garden", "tree service", "irrigation"],
    services: [
      "Lawn Mowing - $40+/visit", "Landscape Design - $500+", "Tree Trimming - $200+",
      "Irrigation Install - $1000+", "Hardscaping - $2000+", "Weekly Maintenance - $150+/mo",
      "Seasonal Cleanup - $250+",
    ],
    painPoints: [
      "Seasonal fluctuations — busy spring/summer, slow winter",
      "Customers want instant quotes but every yard is different",
      "Crews are in the field all day — nobody answering the office phone",
      "Recurring clients forget to renew or switch to cheaper competitors",
    ],
    aiSolves: [
      "AI captures leads with address + photos for pre-quoting before site visit",
      "Automated seasonal upsells: fall cleanup, winterization, spring prep",
      "24/7 lead capture while crews work — never miss a new client inquiry",
      "Renewal reminders and loyalty pricing for recurring maintenance clients",
    ],
    workflows: ["lead-capture", "quoting", "scheduling", "recurring-billing", "seasonal-campaigns", "reviews"],
    metrics: ["Recurring client retention", "Seasonal revenue balance", "Lead response time", "Jobs per crew per day"],
    hours: "Mon-Sat 7am-5pm",
    accent: "#22c55e",
    hero: "https://images.unsplash.com/photo-1558904541-efa843a96f01?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1591857177580-dc82b9ac4e1e?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1585320806297-9794b3e4eeae?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=600&q=80",
    ],
  },

  cleaning: {
    category: "Home Services",
    keywords: ["cleaning", "cleaner", "maid", "janitorial", "house cleaning", "commercial cleaning"],
    services: [
      "Standard Clean - $120", "Deep Clean - $200", "Move In/Out - $250",
      "Office Cleaning - $150", "Weekly Service - $100/visit", "Post-Construction - $300+",
    ],
    painPoints: [
      "High client turnover — hard to keep recurring clients",
      "Pricing varies by home size but clients want instant quotes",
      "Scheduling across multiple crews and locations is a nightmare",
      "No professional presence — competing with random Craigslist ads",
    ],
    aiSolves: [
      "AI qualifies leads with home size, frequency, special needs for instant estimates",
      "Automated rebooking reminders keep recurring clients on schedule",
      "Multi-crew scheduling and route optimization suggestions",
      "Professional website with pricing calculator and instant booking",
    ],
    workflows: ["lead-capture", "quoting", "scheduling", "recurring-billing", "reviews", "crew-management"],
    metrics: ["Client retention rate", "Revenue per crew", "Quote-to-close rate", "Recurring client percentage"],
    hours: "Mon-Sat 7am-6pm",
    accent: "#14b8a6",
    hero: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1527515637462-cff94eecc1ac?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1585421514738-01798e348b17?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1563453392212-326f5e854473?auto=format&fit=crop&w=600&q=80",
    ],
  },

  auto_detailing: {
    category: "Home Services",
    keywords: ["auto detailing", "car detailing", "detailing", "car wash", "ceramic coating", "paint correction"],
    services: [
      "Basic Wash - $30", "Full Detail - $150", "Interior Detail - $80",
      "Exterior Detail - $80", "Ceramic Coating - $300+", "Paint Correction - $200+",
      "Headlight Restoration - $50",
    ],
    painPoints: [
      "Mobile detailing means you're driving all day — can't answer calls",
      "Customers want to see before/after results before booking",
      "Seasonal demand: hot summers = more detailing, winter = dead",
      "Upselling from basic wash to full detail is hit or miss",
    ],
    aiSolves: [
      "AI books while you detail — collects vehicle type, location, and package preference",
      "Website with before/after gallery builds trust and justifies premium pricing",
      "Seasonal campaigns: 'Winter salt wash special', 'Spring detail package'",
      "AI upsells intelligently: 'For $50 more, ceramic coating protects your paint for 2 years'",
    ],
    workflows: ["booking", "upsell", "portfolio", "seasonal-campaigns", "reviews", "mobile-scheduling"],
    metrics: ["Average ticket size", "Upsell rate", "Before/after engagement", "Repeat client rate"],
    hours: "Mon-Sat 8am-6pm",
    accent: "#64748b",
    hero: "https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1607860108855-64acf2078ed9?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1507136566006-cfc505b114fc?auto=format&fit=crop&w=600&q=80",
    ],
  },

  // ─── RETAIL / PRODUCT SALES ───────────────────────────────────────

  retail: {
    category: "Retail",
    keywords: ["retail", "store", "shop", "boutique", "clothing", "jewelry", "smoke shop", "convenience", "gift shop"],
    services: [
      "In-Store Shopping", "Online Store", "Curbside Pickup", "Gift Wrapping",
      "Loyalty Program", "Special Orders", "Personal Shopping",
    ],
    painPoints: [
      "Customers ask 'Do you have this in stock?' all day — takes staff away from selling",
      "No online store means missing all e-commerce revenue",
      "Inventory tracking is manual — overselling and stockouts happen",
      "Competing with Amazon on price is impossible — need to compete on experience",
    ],
    aiSolves: [
      "AI answers stock questions instantly from inventory data — 'Yes, we have size M in blue'",
      "Website with product catalog and online ordering captures after-hours sales",
      "AI tracks what customers ask about most — reveals demand trends for purchasing",
      "Personalized recommendations: 'You bought X last time — Y just came in, you'd love it'",
      "Loyalty program management — points, rewards, VIP notifications",
    ],
    workflows: ["product-catalog", "inventory-queries", "online-orders", "loyalty", "restock-alerts", "reviews"],
    metrics: ["Revenue per customer", "Online vs in-store ratio", "Inventory turnover", "Loyalty program engagement"],
    hours: "Mon-Sat 10am-7pm, Sun 11am-5pm",
    accent: "#ec4899",
    hero: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1472851294608-062f824d29cc?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?auto=format&fit=crop&w=600&q=80",
    ],
  },

  ecommerce: {
    category: "Retail",
    keywords: ["ecommerce", "e-commerce", "online store", "dropship", "shopify", "handmade", "etsy", "amazon seller"],
    services: [
      "Product Listings", "Order Fulfillment", "Customer Support", "Returns & Exchanges",
      "Subscription Boxes", "Wholesale", "Custom Orders",
    ],
    painPoints: [
      "Customer support tickets pile up — 'Where's my order?' 50 times a day",
      "Cart abandonment rate is sky-high with no follow-up",
      "Returns and exchanges handled manually waste hours",
      "No way to re-engage past customers for repeat purchases",
    ],
    aiSolves: [
      "AI handles order tracking, shipping status, and delivery questions automatically",
      "Abandoned cart recovery: AI texts/emails within 1 hour with incentive to complete purchase",
      "Returns processing: AI collects reason, generates label, processes exchange",
      "Re-engagement campaigns: 'You bought X 30 days ago — ready for a refill?'",
      "Product recommendations based on purchase history and browsing behavior",
    ],
    workflows: ["order-support", "cart-recovery", "returns", "re-engagement", "product-recommendations", "reviews"],
    metrics: ["Cart recovery rate", "Support ticket resolution time", "Repeat purchase rate", "Customer lifetime value"],
    hours: "Online 24/7",
    accent: "#8b5cf6",
    hero: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1563013544-824ae1b704d3?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80",
    ],
  },

  // ─── PROFESSIONAL SERVICES ────────────────────────────────────────

  legal: {
    category: "Professional Services",
    keywords: ["lawyer", "attorney", "law firm", "legal", "paralegal", "notary"],
    services: [
      "Free Consultation", "Family Law", "Business Law", "Estate Planning",
      "Personal Injury", "Criminal Defense", "Immigration", "Real Estate Law",
    ],
    painPoints: [
      "Potential clients call after hours — by morning they've hired someone else",
      "Intake calls take 15-20 minutes each just to qualify the lead",
      "No way to filter serious clients from tire-kickers",
      "Competitors have slick websites — you have a template from 2015",
    ],
    aiSolves: [
      "AI qualifies leads 24/7: case type, urgency, budget range — before you ever speak to them",
      "Automated intake form collection with conflict check data points",
      "Priority scoring: AI flags high-value cases for immediate callback",
      "Modern website with practice area pages, attorney bios, testimonials, and consultation booking",
    ],
    workflows: ["lead-capture", "intake-screening", "priority-scoring", "consultation-booking", "follow-up", "reviews"],
    metrics: ["Lead qualification rate", "Intake time saved", "Consultation booking rate", "Cost per acquired client"],
    hours: "Mon-Fri 8am-6pm, AI intake 24/7",
    accent: "#1e3a5f",
    hero: "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1505663912202-ac22d4cb3707?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1521791055366-0d553872125f?auto=format&fit=crop&w=600&q=80",
    ],
  },

  accounting: {
    category: "Professional Services",
    keywords: ["accountant", "cpa", "bookkeeper", "tax", "accounting", "bookkeeping", "tax preparer"],
    services: [
      "Tax Preparation - $200+", "Bookkeeping - $300+/mo", "Payroll - $150+/mo",
      "Business Formation - $500+", "Tax Planning - $500+", "Audit Support - $1000+",
      "Financial Consulting - $200/hr",
    ],
    painPoints: [
      "Tax season overwhelm — 100+ clients all needing attention in 3 months",
      "Clients send documents piecemeal — chasing missing forms wastes hours",
      "Off-season revenue drops dramatically",
      "Client communication: same questions every year about deadlines and documents",
    ],
    aiSolves: [
      "AI handles client document collection: sends checklists, tracks what's missing, sends reminders",
      "Automated deadline reminders: estimated taxes, filing deadlines, extension deadlines",
      "Off-season engagement: AI pitches tax planning, bookkeeping, and year-round services",
      "FAQ bot answers 'When are taxes due?' and 'What documents do I need?' 24/7",
    ],
    workflows: ["lead-capture", "document-collection", "deadline-reminders", "seasonal-campaigns", "follow-up", "reviews"],
    metrics: ["Client retention rate", "Document completion rate", "Off-season revenue", "Time saved on admin"],
    hours: "Mon-Fri 9am-5pm (extended Jan-Apr)",
    accent: "#059669",
    hero: "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1554224154-22dec7ec8818?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80",
    ],
  },

  realestate: {
    category: "Professional Services",
    keywords: ["real estate", "realtor", "real estate agent", "broker", "property management", "property manager"],
    services: [
      "Home Buying", "Home Selling", "Property Valuation", "Market Analysis",
      "Property Management", "Investment Consulting", "Commercial Real Estate",
    ],
    painPoints: [
      "Leads from Zillow/Realtor.com go cold in hours if not responded to",
      "Showing scheduling is a back-and-forth nightmare",
      "Buyers ask the same questions about every listing — drains your time",
      "No way to nurture long-term leads who aren't ready to buy yet",
    ],
    aiSolves: [
      "AI responds to portal leads in under 60 seconds — 10x faster than competitors",
      "Automated showing scheduling with calendar integration",
      "AI answers listing questions: sq ft, price, neighborhood, schools, commute times",
      "Drip campaigns for long-term leads: monthly market updates until they're ready",
      "Open house follow-up: AI texts attendees within 1 hour for feedback",
    ],
    workflows: ["lead-capture", "lead-nurture", "showing-scheduling", "listing-questions", "drip-campaigns", "reviews"],
    metrics: ["Lead response time", "Lead-to-showing rate", "Showing-to-offer rate", "Average days on market"],
    hours: "Mon-Sun 8am-8pm, AI 24/7",
    accent: "#0ea5e9",
    hero: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1570129477492-45c003edd2be?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=600&q=80",
    ],
  },

  insurance: {
    category: "Professional Services",
    keywords: ["insurance", "insurance agent", "insurance broker", "life insurance", "auto insurance", "home insurance"],
    services: [
      "Auto Insurance", "Home Insurance", "Life Insurance", "Business Insurance",
      "Health Insurance", "Renters Insurance", "Umbrella Policy", "Free Quote",
    ],
    painPoints: [
      "Quoting is time-consuming — each client needs a custom comparison",
      "Renewal follow-ups fall through the cracks — clients leave for cheaper options",
      "Hard to differentiate from online insurance companies",
      "Cross-selling (auto → home → life) happens rarely without a system",
    ],
    aiSolves: [
      "AI collects quote information (vehicle, home details, coverage needs) before you touch it",
      "Automated renewal reminders 60/30/15 days before expiration with re-quote",
      "Personal service positioning: 'Unlike Geico, I'm YOUR agent — AI just helps me serve you faster'",
      "Cross-sell triggers: 'You have auto with us — did you know bundling home saves 15%?'",
    ],
    workflows: ["lead-capture", "quoting", "renewal-reminders", "cross-sell", "claims-support", "reviews"],
    metrics: ["Policies per client", "Renewal retention rate", "Quote-to-bind rate", "Referral rate"],
    hours: "Mon-Fri 9am-5pm, AI quotes 24/7",
    accent: "#2563eb",
    hero: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1554224155-6726b3ff858f?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1507679799987-c73779587ccf?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1521791055366-0d553872125f?auto=format&fit=crop&w=600&q=80",
    ],
  },

  // ─── HEALTH & MEDICAL ────────────────────────────────────────────

  dental: {
    category: "Healthcare",
    keywords: ["dentist", "dental", "orthodontist", "dental office", "teeth", "oral"],
    services: [
      "Cleaning & Exam - $150", "Filling - $200+", "Crown - $800+", "Root Canal - $700+",
      "Teeth Whitening - $300+", "Invisalign - $4000+", "Emergency Visit - $200+",
    ],
    painPoints: [
      "Patients avoid the dentist — need proactive recall reminders",
      "Front desk spends 60% of time on phone scheduling instead of patient care",
      "Insurance verification questions are repetitive and time-consuming",
      "New patient forms are still paper — slows everything down",
    ],
    aiSolves: [
      "AI handles scheduling, rescheduling, and recall reminders — frees up front desk",
      "Automated 6-month cleaning reminders: 'You're due for a cleaning — book here'",
      "AI answers insurance questions: 'We accept Delta Dental, Aetna, Cigna...'",
      "Digital intake forms sent before appointment — patient arrives ready",
    ],
    workflows: ["scheduling", "recall-reminders", "insurance-faq", "intake-forms", "reviews", "follow-up"],
    metrics: ["Patient recall rate", "Front desk time saved", "New patient acquisition", "Google rating"],
    hours: "Mon-Fri 8am-5pm, Sat 8am-12pm",
    accent: "#0891b2",
    hero: "https://images.unsplash.com/photo-1629909613654-28e377c37b09?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1606811841689-23dfddce3e95?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1445527815219-ecbfec67492e?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1571772996211-2f02c9727629?auto=format&fit=crop&w=600&q=80",
    ],
  },

  therapy: {
    category: "Healthcare",
    keywords: ["therapist", "counselor", "psychologist", "mental health", "counseling", "therapy", "psychiatrist", "chiropractor", "physical therapy"],
    services: [
      "Initial Assessment - $150", "Individual Session - $120", "Couples Therapy - $150",
      "Family Therapy - $160", "Group Therapy - $50", "Teletherapy - $120",
    ],
    painPoints: [
      "Can't answer phone during sessions — clients call someone else",
      "New client intake is a 45-minute administrative process",
      "Cancellations and no-shows cost $100+ per empty slot",
      "Marketing feels wrong for therapists — but you still need clients",
    ],
    aiSolves: [
      "AI handles new client inquiries during sessions — screens for fit and urgency",
      "Digital intake forms and questionnaires completed before first session",
      "48hr/24hr/2hr reminder sequence with easy reschedule link (not cancellation)",
      "Tasteful web presence focused on specialties, approach, and booking — not 'sales'",
    ],
    workflows: ["scheduling", "intake-screening", "reminders", "waitlist", "follow-up", "teletherapy-links"],
    metrics: ["Client retention", "No-show rate", "Intake completion rate", "Session utilization"],
    hours: "Mon-Fri 8am-7pm, Sat 9am-1pm",
    accent: "#7c3aed",
    hero: "https://images.unsplash.com/photo-1573497620053-ea5300f94f21?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1600880292203-757bb62b4baf?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=600&q=80",
    ],
  },

  // ─── MANUFACTURING / INDUSTRIAL ───────────────────────────────────

  manufacturing: {
    category: "Manufacturing",
    keywords: ["manufacturing", "manufacturer", "factory", "fabrication", "machining", "cnc", "welding", "production", "assembly"],
    services: [
      "Custom Fabrication", "CNC Machining", "Welding & Assembly", "Prototyping",
      "Production Runs", "Quality Inspection", "Design Engineering", "Rush Orders",
    ],
    painPoints: [
      "RFQ process is slow — customers email specs and wait days for a quote",
      "Production scheduling across multiple orders is complex",
      "Quality issues aren't caught until customer complaints come in",
      "No visibility into order status — customers call constantly for updates",
    ],
    aiSolves: [
      "AI collects RFQ details instantly: material, quantity, specs, drawings, timeline — ready for your estimator",
      "Order status bot: customers check 'Where's my order?' without calling",
      "Automated quality check reminders at each production stage",
      "Website with capabilities showcase, certifications, and instant RFQ submission",
      "Follow-up on quotes not yet accepted — 'Ready to move forward on that order?'",
    ],
    workflows: ["rfq-collection", "order-tracking", "quality-checkpoints", "follow-up", "capability-showcase", "lead-capture"],
    metrics: ["RFQ response time", "Quote-to-order rate", "On-time delivery rate", "Customer inquiry resolution"],
    hours: "Mon-Fri 6am-5pm",
    accent: "#71717a",
    hero: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1567789884554-0b844b597180?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1537462715927-76d1f4523e21?auto=format&fit=crop&w=600&q=80",
    ],
  },

  printing: {
    category: "Manufacturing",
    keywords: ["printing", "print shop", "screen printing", "signage", "signs", "banners", "custom printing", "packaging"],
    services: [
      "Business Cards - $50+", "Banners - $100+", "Vehicle Wraps - $1500+",
      "Custom T-Shirts - $15+/ea", "Signage - $200+", "Packaging Design - $500+",
      "Large Format Printing - $10+/sqft",
    ],
    painPoints: [
      "Every order is custom — quoting takes forever",
      "File format issues: clients send wrong resolution, wrong dimensions",
      "Proofing back-and-forth delays production",
      "Repeat customers forget to reorder until they're out — then it's a rush job",
    ],
    aiSolves: [
      "AI collects order specs: size, quantity, material, finish, colors — generates estimate instantly",
      "File upload portal with automatic format validation and guidelines",
      "Proofing workflow: AI sends digital proof, collects approval, triggers production",
      "Reorder reminders for repeat customers: 'Running low on business cards? Same order?'",
    ],
    workflows: ["quoting", "file-collection", "proofing", "order-tracking", "reorder-reminders", "lead-capture"],
    metrics: ["Quote turnaround time", "Proof approval speed", "Repeat order rate", "Rush job percentage"],
    hours: "Mon-Fri 8am-5pm",
    accent: "#d946ef",
    hero: "https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1567789884554-0b844b597180?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1537462715927-76d1f4523e21?auto=format&fit=crop&w=600&q=80",
    ],
  },

  // ─── EVENTS ───────────────────────────────────────────────────────

  events: {
    category: "Events",
    keywords: ["event planner", "wedding planner", "dj", "florist", "venue", "caterer", "event", "party"],
    services: [
      "Event Planning - $1000+", "Wedding Packages - $3000+", "DJ Services - $500+",
      "Floral Arrangements - $200+", "Venue Rental - $1500+", "Day-of Coordination - $800+",
    ],
    painPoints: [
      "Leads ask for availability on specific dates — slow response loses the gig",
      "Custom quotes for every event are time-consuming",
      "No centralized portfolio of past events to show potential clients",
      "Vendor coordination across multiple events is chaotic",
    ],
    aiSolves: [
      "AI checks date availability and collects event details instantly",
      "Smart quoting: AI asks event type, guest count, preferences → generates estimate",
      "Portfolio website with event galleries organized by type and season",
      "Event timeline management: AI sends prep reminders to all vendors",
    ],
    workflows: ["lead-capture", "availability-check", "quoting", "portfolio", "timeline-management", "reviews"],
    metrics: ["Inquiry-to-booking rate", "Average event value", "Vendor coordination efficiency", "Repeat client rate"],
    hours: "Mon-Fri 9am-6pm, Events on weekends",
    accent: "#e11d48",
    hero: "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1478146059778-26028b07395a?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?auto=format&fit=crop&w=600&q=80",
    ],
  },

  // ─── EDUCATION / CREATIVE ─────────────────────────────────────────

  education: {
    category: "Education",
    keywords: ["tutor", "tutoring", "music teacher", "dance studio", "art studio", "coding", "academy", "school", "instructor", "coach"],
    services: [
      "Private Lessons - $50+/hr", "Group Classes - $25+/session", "Monthly Program - $200+/mo",
      "Summer Camp - $300+/week", "Online Lessons - $40+/hr", "Assessment - $75",
    ],
    painPoints: [
      "Parents call during classes — can't answer",
      "Trial lesson no-shows are frequent and waste prep time",
      "Tracking student progress and communicating with parents is scattered",
      "Seasonal enrollment drops (summer, holidays) hurt revenue",
    ],
    aiSolves: [
      "AI handles enrollment inquiries and schedules trial lessons 24/7",
      "Reminder system with parent confirmation reduces no-shows",
      "Automated progress updates to parents after each milestone",
      "Seasonal campaigns: summer camp promotion, back-to-school enrollment",
    ],
    workflows: ["enrollment", "scheduling", "reminders", "progress-updates", "seasonal-campaigns", "reviews"],
    metrics: ["Enrollment rate", "Trial-to-enrollment conversion", "Student retention", "Class fill rate"],
    hours: "Mon-Sat, varies by class schedule",
    accent: "#0ea5e9",
    hero: "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=600&q=80",
    ],
  },

  // ─── TECH / DIGITAL SERVICES ──────────────────────────────────────

  agency: {
    category: "Tech & Digital",
    keywords: ["marketing agency", "web design", "digital agency", "seo", "social media", "it support", "tech support", "marketing", "creative agency"],
    services: [
      "Website Design - $2000+", "SEO - $500+/mo", "Social Media Management - $800+/mo",
      "PPC Advertising - $1000+/mo", "Brand Identity - $1500+", "Content Creation - $500+/mo",
    ],
    painPoints: [
      "Client onboarding is a multi-week process of back-and-forth",
      "Project scope creep — clients keep adding 'just one more thing'",
      "Lead qualification: too many tire-kickers requesting free audits",
      "Monthly reporting takes hours to compile for each client",
    ],
    aiSolves: [
      "AI qualifies leads: budget, timeline, goals — filters serious buyers before you speak",
      "Streamlined onboarding: AI collects brand guidelines, assets, access credentials in structured flow",
      "Scope management: AI documents agreed deliverables and flags out-of-scope requests",
      "Automated monthly report generation with key metrics and plain-language insights",
    ],
    workflows: ["lead-capture", "lead-scoring", "onboarding", "scope-management", "reporting", "reviews"],
    metrics: ["Lead quality score", "Client retention", "Onboarding time", "Monthly recurring revenue"],
    hours: "Mon-Fri 9am-6pm",
    accent: "#6366f1",
    hero: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1553877522-43269d4ea984?auto=format&fit=crop&w=600&q=80",
    ],
  },

  // ─── AUTOMOTIVE ───────────────────────────────────────────────────

  mechanic: {
    category: "Automotive",
    keywords: ["mechanic", "auto repair", "auto shop", "body shop", "tire shop", "transmission", "car repair"],
    services: [
      "Oil Change - $40+", "Brake Service - $200+", "Engine Diagnostic - $100",
      "Tire Rotation - $30", "Transmission Service - $300+", "AC Repair - $200+",
      "Inspection - $50",
    ],
    painPoints: [
      "Customers don't know what's wrong — just 'my car makes a noise'",
      "Phone rings during repairs — hands are greasy, can't answer",
      "Competing with dealer service departments on trust and pricing",
      "No way to remind customers about scheduled maintenance",
    ],
    aiSolves: [
      "AI symptom checker: 'Describe the noise' → suggests likely issue and urgency level",
      "24/7 appointment booking while you work — never miss a customer",
      "Transparent pricing on website builds trust vs. dealer markup",
      "Automated maintenance reminders based on mileage and service history",
    ],
    workflows: ["booking", "symptom-triage", "reminders", "maintenance-schedule", "reviews", "follow-up"],
    metrics: ["Customer return rate", "Average repair ticket", "Maintenance plan adoption", "Google rating"],
    hours: "Mon-Fri 7am-6pm, Sat 8am-3pm",
    accent: "#dc2626",
    hero: "https://images.unsplash.com/photo-1486262715619-67b85e0b08d3?auto=format&fit=crop&w=1200&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1580273916550-e323be2ae537?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1601362840469-51e4d8d58785?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1507136566006-cfc505b114fc?auto=format&fit=crop&w=600&q=80",
      "https://images.unsplash.com/photo-1625047509248-ec889cbff17f?auto=format&fit=crop&w=600&q=80",
    ],
  },
};

function withRoles(profile: Omit<IndustryProfile, "roles">, key: string): IndustryProfile {
  return { ...profile, roles: getRolesForIndustry(profile.category, key) } as IndustryProfile;
}

export function matchIndustry(input: string): IndustryProfile | null {
  const t = input.toLowerCase();
  for (const [key, profile] of Object.entries(INDUSTRIES)) {
    if (profile.keywords.some((kw) => t.includes(kw))) return withRoles(profile, key);
  }
  return null;
}

export function getIndustryByKey(key: string): IndustryProfile {
  const p = INDUSTRIES[key] || INDUSTRIES.retail;
  return withRoles(p, key);
}

export function getAllCategories(): string[] {
  const cats = new Set<string>();
  for (const profile of Object.values(INDUSTRIES)) cats.add(profile.category);
  return Array.from(cats);
}

export function getIndustriesByCategory(category: string): [string, IndustryProfile][] {
  return Object.entries(INDUSTRIES)
    .filter(([, p]) => p.category === category)
    .map(([key, p]) => [key, withRoles(p, key)]);
}

export function buildIndustryKnowledgeBlock(): string {
  return Object.entries(INDUSTRIES)
    .map(([key, p]) => {
      const services = p.services.slice(0, 5).join(", ");
      const problems = p.painPoints.slice(0, 2).join("; ");
      const solutions = p.aiSolves.slice(0, 2).join("; ");
      return `${key.toUpperCase()} (${p.category}): Services: ${services} | Pain: ${problems} | AI Fix: ${solutions} | Hours: ${p.hours}`;
    })
    .join("\n");
}

export function buildRoleBlock(category: string, key: string): string {
  const roles = getRolesForIndustry(category, key);
  if (!roles.length) return "";
  return roles.map((r) => `${r.title}: Thinks: "${r.thinks}" | Does: ${r.does.join("; ")}`).join("\n");
}
