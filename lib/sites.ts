/**
 * Sites built by Trion — proof that agents deliver real value
 * preview: subject-relevant image for each site
 */

export interface Site {
  name: string;
  url: string;
  category: string;
  description?: string;
  preview?: string;
}

export const TRION_SITES: Site[] = [
  { name: "CashNowZap", url: "https://cashnowzap.com/", category: "Fintech", description: "Digital payment setup — USDC, crypto", preview: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?w=600&q=80" },
  { name: "CryptoNowZap", url: "https://cryptonowzap.com/", category: "Fintech", description: "Crypto wallet coaching", preview: "https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=600&q=80" },
  { name: "iCode Sacramento", url: "https://invinciblelude.github.io/icodesacramento", category: "Education", description: "STEM education franchise", preview: "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=600&q=80" },
  { name: "Diesel Delights", url: "https://dieseldelights.com", category: "Food", description: "Vietnamese soul food", preview: "https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80" },
  { name: "Diesel Delights Endorse", url: "https://dieseldelights.com/endorse.html", category: "Food", description: "Testimonials", preview: "https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80" },
  { name: "Bangkok Garden Sauces", url: "https://invinciblelude.github.io/thaibankokgarden/", category: "Food", description: "30-year Thai sauce line", preview: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&q=80" },
  { name: "PeptideEats", url: "https://peptideeats.com/", category: "Health", description: "Food-first health, Peptide Score", preview: "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=600&q=80" },
  { name: "CRM Data Intelligence", url: "https://invinciblelude.github.io/CRMDataIntel/", category: "B2B", description: "Data cleaning, 7+ industries", preview: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&q=80" },
  { name: "Bianchi-Tillett Developers", url: "https://bianchi-tillettdevelopers.com/", category: "Construction", description: "Design-build, luxury homes", preview: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&q=80" },
  { name: "Bianchi Group", url: "https://www.bianchi-tillett.com", category: "Real Estate", description: "Investment portfolio", preview: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80" },
  { name: "Bianchi Unlimited Market", url: "https://invinciblelude.github.io/Bianchi-Unlimited-Market-/", category: "Real Estate", description: "Syndicate & marketing", preview: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?w=600&q=80" },
  { name: "Development Outlook", url: "https://invinciblelude.github.io/developement-outlook-BInachi/", category: "Construction", description: "Operator portfolio", preview: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&q=80" },
  { name: "Vista Lake Estates", url: "https://invinciblelude.github.io/vista-lake-estates/", category: "Real Estate", description: "15 luxury lots, Granite Bay", preview: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&q=80" },
  { name: "TheNetwork20", url: "https://thenetwork20.com", category: "Talent", description: "Trade workers marketplace", preview: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&q=80" },
];

export const SITE_CATEGORIES = [...new Set(TRION_SITES.map((s) => s.category))].sort();
