import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
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
  title: "Trion Express | AI Business Team — Answer, Book & Grow 24/7",
  description:
    "AI agent for barbers, salons, restaurants, contractors. Answers customers 24/7, books appointments, captures leads, collects reviews. Live site in 24 hours. See your preview in 60 seconds.",
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
            <Link href="/" className="flex items-center gap-2 font-bold tracking-tight text-foreground">
              <Image src="/trion-express-logo.png" alt="" width={32} height={32} className="rounded-lg" />
              <span>Trion Express</span>
            </Link>
            <div className="flex items-center gap-4 text-sm text-muted">
              <a href="/#services" className="hidden sm:block transition-colors hover:text-foreground">
                Services
              </a>
              <Link href="/pitch" className="hidden sm:block transition-colors hover:text-foreground">
                Hire Agent
              </Link>
              <a href="/#sites" className="hidden sm:block transition-colors hover:text-foreground">
                Sites
              </a>
              <a href="/#analysis" className="hidden sm:block transition-colors hover:text-foreground">
                Analysis
              </a>
              <a href="/#reports" className="hidden sm:block transition-colors hover:text-foreground">
                Reports
              </a>
              <Link href="/pro-demo" className="hidden sm:block transition-colors hover:text-foreground">
                Pro
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
