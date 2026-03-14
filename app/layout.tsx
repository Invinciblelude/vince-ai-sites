import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
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
  title: "Trion Express | Your AI Business Team — Answer, Log, Book 24/7",
  description:
    "Trion Express — AI agent that answers customers, captures leads, books appointments, and collects reviews. 14+ sites launched.",
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
            <Link href="/" className="font-bold tracking-tight text-foreground">
              Trion Express
            </Link>
            <div className="flex items-center gap-4 text-sm text-muted">
              <a href="/#services" className="hidden sm:block transition-colors hover:text-foreground">
                Services
              </a>
              <Link href="/sites" className="hidden sm:block transition-colors hover:text-foreground">
                Sites
              </Link>
              <Link
                href="/pitch#plans"
                className="rounded-lg bg-accent px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-accent-dim"
              >
                Get Your Own
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
