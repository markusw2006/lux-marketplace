Lux — CDMX Instant-Book Services Marketplace (Web MVP)

## Getting Started

First, copy `.env.local.example` to `.env.local`, fill keys, then run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

Tech: Next.js 14 (App Router), Tailwind, Supabase, Stripe Connect, next-intl.

## Learn More

Server routes
- GET `/api/services` list services
- GET `/api/services/:id` service detail
- POST `/api/bookings/instant` create PaymentIntent (manual capture)
- POST `/api/stripe/webhook` Stripe webhooks

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

Deploy on Vercel for best DX.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
