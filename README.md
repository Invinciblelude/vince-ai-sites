# Trion Express

Trion Express — AI business team (answer, log, book, review). Home, pitch demo, live sites, client dashboard. Built with Next.js. Deploy at trionexpress.com.

## Key Pages

- **/** — Home (services, Trion AI assistant)
- **/pitch** — Trion demo: talk to Trion, get a site preview, go live
- **/sites** — 14+ Trion-built sites (sign up required)
- **/clients** — Client Dashboard (private — only `ADMIN_EMAIL` can access)
- **/login** — Sign up / log in (Google OAuth)

## Agent End-to-End

See [docs/AGENT-END-TO-END.md](docs/AGENT-END-TO-END.md) for how Trion agents perform answer, log, and book actions via skills and OpenClaw.

## Getting Started

1. Copy `.env.example` to `.env.local` and fill in your values.
2. Set `ADMIN_EMAIL` to your Google account email so only you can access `/clients`.
3. Run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
