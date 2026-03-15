"use client";

import { useState } from "react";
import Link from "next/link";
import { BOOK_CALL_URL } from "@/lib/config";

const navLinks = [
  { href: "/home#launch", label: "Launch" },
  { href: "/pitch", label: "Trion Ultra" },
  { href: "/home#sites", label: "Sites" },
  { href: "/home#services", label: "Services" },
  {
    href: BOOK_CALL_URL,
    label: "Make an appointment",
    external: !BOOK_CALL_URL.startsWith("/"),
    green: true,
  },
  { href: "/partnership", label: "Partnership" },
];

export function NavMobile() {
  const [open, setOpen] = useState(false);

  return (
    <div className="sm:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted transition-colors hover:bg-card hover:text-foreground"
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open ? "true" : "false"}
      >
        {open ? (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        )}
      </button>
      {open && (
        <>
          <div
            className="fixed inset-0 z-40 bg-black/20"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <div
            className="fixed right-4 top-16 z-50 min-w-[200px] rounded-xl border border-border bg-background p-3 shadow-lg"
            role="dialog"
            aria-label="Navigation menu"
          >
            <nav className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const cls = `block rounded-lg px-3 py-2 text-sm transition-colors hover:bg-card ${
                  link.green ? "font-medium text-green hover:text-green" : "text-muted hover:text-foreground"
                }`;
                if (link.external) {
                  return (
                    <a
                      key={link.href}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cls}
                      onClick={() => setOpen(false)}
                    >
                      {link.label}
                    </a>
                  );
                }
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={cls}
                    onClick={() => setOpen(false)}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>
          </div>
        </>
      )}
    </div>
  );
}
