import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import { BOOK_CALL_URL } from "@/lib/config";
import { NavAuth } from "@/components/nav-auth";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Trion Express | Simple Websites + 24/7 AI for Local Businesses",
  description:
    "We build websites with AI assistants for contractors, restaurants, barbershops. Launch $500–$1,500 setup or Trion Ultra $750–$2,000 + $49–$199/mo. Recurring revenue model. Done in 7–14 days. Book a free call.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
          <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
            <Link href="/home" className="flex items-center gap-2 font-bold tracking-tight text-foreground">
              <Image src="/trion-express-logo-orange.png" alt="" width={32} height={32} className="rounded-lg" />
              <span>Trion Express</span>
            </Link>
            <div className="flex items-center gap-4 text-sm text-muted">
              <a href="/home#launch" className="hidden sm:block transition-colors hover:text-foreground">
                Launch
              </a>
              <Link href="/pitch" className="hidden sm:block transition-colors hover:text-foreground font-medium">
                Trion Ultra
              </Link>
              <a href="/home#sites" className="hidden sm:block transition-colors hover:text-foreground">
                Sites
              </a>
              <a href="/home#services" className="hidden sm:block transition-colors hover:text-foreground">
                Services
              </a>
              {BOOK_CALL_URL.startsWith("/") ? (
                <Link href={BOOK_CALL_URL} className="hidden sm:block transition-colors hover:text-foreground font-medium text-green">
                  Make an appointment
                </Link>
              ) : (
                <a href={BOOK_CALL_URL} target="_blank" rel="noopener noreferrer" className="hidden sm:block transition-colors hover:text-foreground font-medium text-green">
                  Make an appointment
                </a>
              )}
              <Link href="/partnership" className="hidden sm:block transition-colors hover:text-foreground">
                Partnership
              </Link>
              <NavAuth />
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
