import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
  title: "Vince Dang | Entrepreneur, Builder, AI Developer",
  description:
    "General contractor, real estate investor, and AI developer based in Sacramento. I build AI-powered systems for businesses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <nav className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
          <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
            <Link href="/" className="font-bold tracking-tight text-foreground">
              Vince Dang
            </Link>
            <div className="flex items-center gap-5 text-sm text-muted">
              <a href="/#about" className="hidden sm:block transition-colors hover:text-foreground">
                About
              </a>
              <a href="/#services" className="hidden sm:block transition-colors hover:text-foreground">
                Services
              </a>
              <a href="/#schedule" className="transition-colors hover:text-foreground">
                Schedule
              </a>
              <Link
                href="/try"
                className="rounded-lg bg-accent px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-accent-dim"
              >
                Get Your Own
              </Link>
            </div>
          </div>
        </nav>
        {children}
      </body>
    </html>
  );
}
