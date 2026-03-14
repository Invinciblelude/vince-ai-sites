/**
 * Feasibility reports & analysis — what Trion can produce for clients.
 * Add your report URLs here to showcase on the site. Reports can be PDFs, Google Docs, or hosted pages.
 */

export interface FeasibilityReport {
  title: string;
  description: string;
  category: string;
  url: string;
  preview?: string;
}

export const FEASIBILITY_REPORTS: FeasibilityReport[] = [
  {
    title: "Garden Highway Feasibility Report",
    description: "Full feasibility study — market analysis, site assessment, and development projections for Garden Highway.",
    category: "Construction",
    url: "/reports/Garden_Hwy_Feasibility_Report_Final.pdf",
    preview: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80",
  },
  {
    title: "8445 Citadel Way — Roofing Estimate",
    description: "Detailed roofing estimate and project analysis for residential property.",
    category: "Construction",
    url: "/reports/8445_Citadel_Way_Roofing_Estimate.pdf",
    preview: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&q=80",
  },
  {
    title: "Silver Crowd Craft — Construction Feasibility",
    description: "Market analysis and project feasibility for construction projects dashboard. Capacity planning, resource allocation, timeline projections.",
    category: "Construction",
    url: "https://silvercrowdcraft.com/",
    preview: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=80",
  },
  {
    title: "4929 Nerrads Place — Strategy Analysis",
    description: "Complete strategy analysis: Sell Lots vs Build Homes. Verified infrastructure costs, ROI scenarios, hybrid strategy, de-risking status. Real duties & tasks example.",
    category: "Construction",
    url: "https://silvercrowdcraft.com/nerrads-project.html",
    preview: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=600&q=80",
  },
  {
    title: "Nesting Home Solutions — Wildfire & Disaster",
    description: "Feasibility study for wildfire solutions, disaster sheltering, and training programs. Risk assessment, community preparedness, recovery projections.",
    category: "Construction",
    url: "https://www.nestinghomesolutions.com/",
    preview: "https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=600&q=80",
  },
  {
    title: "Gen Z Mentorship — Market Analysis",
    description: "Market feasibility for mentorship platform. Demographic analysis, competitor landscape, growth projections for Gen Z education space.",
    category: "Education",
    url: "https://genzmentorship.com/",
    preview: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&q=80",
  },
];
