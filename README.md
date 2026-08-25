# ZEVA_Jee G

> A premium direct-to-customer experience for handcrafted ZEVA JEE products.
>
> This repository is the customer-facing Next.js application: catalog discovery, cart interactions, authentication, checkout, order history, reviews, and the visual brand experience.

[![Next.js](https://img.shields.io/badge/Next.js-16-black?logo=next.js)](https://nextjs.org/) [![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue?logo=typescript)](https://www.typescriptlang.org/) [![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?logo=prisma)](https://www.prisma.io/) [![Deployed on Vercel](https://vercel.com/button)](https://ultinum-zeva-g-psi.vercel.app)

## Start here

| If you want to… | Go to… |
| --- | --- |
| Change the landing page | app/page.tsx, components/HeroSection.tsx |
| Change products or pack pricing | lib/catalog.ts |
| Change cart behavior | context/CartContext.tsx, components/cart/ |
| Change checkout rules | components/TastingBoxDrawer.tsx, app/api/orders/route.ts |
| Change authentication | app/layout.tsx, proxy.ts, lib/auth.ts |
| Change database models | prisma/schema.prisma |
| Change member order history | app/dashboard/page.tsx, app/api/orders/route.ts |
| Change reviews | components/TastingReviews.tsx, app/api/reviews/route.ts |
| Change global styling | app/globals.css and component classes |

## What the app does

1. Visitors explore the ZEVA JEE catalog and brand story.
2. The cart persists locally in the browser so an unfinished selection survives refreshes.
3. Visitors can authenticate with Clerk and view their order history.
4. Checkout sends a pack selection and catalog item quantities to the orders API.
5. The server validates products, pack capacity, customer fields, and the trusted price before saving through Prisma.
6. Reviews are displayed from the database with fallback editorial reviews when needed.

## Architecture at a glance

    Browser
      ├─ App Router pages and interactive components
      ├─ CartContext + UserActivityContext
      ├─ Clerk client hooks when authentication is configured
      └─ /api/cart, /api/orders, /api/reviews
               │
               ├─ Clerk authentication and account upsert
               ├─ Catalog validation and server-side pricing
               └─ Prisma Client → SQLite locally / PostgreSQL recommended for production

### Important current data flow

- Current checkout catalog: lib/catalog.ts contains BROTH_CATALOG, BOX_PRICES, and BOX_CAPACITY. The active checkout uses flavorId, quantity, and boxSize.
- Order security boundary: never trust totals, names, product labels, or prices sent by the browser. app/api/orders/route.ts is the authority.
- Naming note: some older files use soup/broth terminology while current brand metadata describes botanical soap. Do not rename the catalog casually; first decide whether the product direction is broth or soap, then migrate catalog, copy, types, and database together.

## Requirements

- Node.js 20 or newer
- npm
- A Clerk application for sign-in, sign-up, and member features
- SQLite for local development; PostgreSQL is the safer production target

## Run locally

### 1. Install

    git clone https://github.com/usama7871/Ultinum_Zeva_g.git
    cd Ultinum_Zeva_g
    npm ci

Use npm install only when intentionally changing dependencies. Prefer npm ci for reproducible verification from package-lock.json.

### 2. Configure environment

Create .env.local in the project root. Never commit this file or real credentials.

    DATABASE_URL="file:./dev.db"
    NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_publishable_key
    CLERK_SECRET_KEY=your_secret_key
    NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
    NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up

The public home page can render without Clerk configured, but authentication and the member dashboard require valid Clerk variables.

### 3. Prepare Prisma and start

    npx prisma generate
    npx prisma db push
    npm run dev

Open http://localhost:3000.

## Verification before every merge

Run the same gate used to validate the current quality branch:

    npx prisma generate
    npx tsc --noEmit
    npm run lint
    npm run build

Also manually test:

- Anonymous visitors can browse and add items.
- The cart survives a refresh.
- Invalid checkout payloads are rejected.
- A valid 4-pack and 8-pack can be submitted.
- A client-edited price cannot change the stored order total.
- Sign-in, sign-up, dashboard, and order history work with Clerk configured.
- Mobile navigation and checkout work at narrow widths.

## API contract

### GET /api/cart

Requires authentication. Returns the signed-in user’s saved cart items.

### PUT /api/cart

Requires authentication. Accepts catalog item IDs and positive integer quantities. The server filters invalid catalog IDs and caps quantities.

### GET /api/orders

Requires authentication. Returns the signed-in user’s orders, newest first.

### POST /api/orders

Supports guest checkout. The active payload is:

    {
      "customerName": "Guest Connoisseur",
      "email": "customer@example.com",
      "shippingAddress": "Delivery address",
      "boxSize": "4-pack",
      "items": [
        { "flavorId": "tomato", "quantity": 2 },
        { "flavorId": "squash", "quantity": 2 }
      ]
    }

The server determines the final price from BOX_PRICES. A 4-pack must contain exactly 4 jars; an 8-pack must contain exactly 8.

### GET /api/reviews and POST /api/reviews

Reviews are validated for required fields, rating range, and maximum lengths before persistence.

## Database

Prisma currently models users, carts, cart items, orders, order items, and reviews in prisma/schema.prisma.

The local SQLite file is useful for development. For production ordering volume, move to PostgreSQL and introduce tracked Prisma migrations before scaling traffic. Do not treat prisma/dev.db as production data.

Useful commands:

    npx prisma studio        # inspect local records
    npx prisma format        # format schema
    npx prisma validate      # validate schema and environment

## Deployment

The live application is deployed on Vercel. Recommended release flow:

1. Create a branch from main.
2. Make one focused change at a time.
3. Run the verification commands above.
4. Review the diff and test the affected user journey.
5. Open a pull request.
6. Merge only after checks pass and production impact is understood.
7. Confirm the Vercel deployment and smoke-test checkout, authentication, and dashboard flows.

Required Vercel environment variables are the same as .env.local, but use the production database URL and production Clerk keys. Never paste secrets into issues, commits, or chat.

## Project map

    app/
      page.tsx                 Public landing page
      layout.tsx               Metadata, providers, and global shell
      dashboard/page.tsx       Authenticated member order history
      api/cart/route.ts        Authenticated cart persistence
      api/orders/route.ts      Order creation and server-side validation
      api/reviews/route.ts     Review reads and writes
      sign-in/, sign-up/       Clerk routes
    components/                Brand UI and interactive experience
    context/                   Browser cart and activity state
    lib/catalog.ts             Active checkout catalog, pack prices, capacity
    lib/catalog-engine.ts      Product pricing/catalog-engine path
    lib/auth.ts                Clerk-to-database account synchronization
    lib/db.ts                  Shared Prisma Client
    prisma/schema.prisma       Database models and relations
    proxy.ts                   Clerk route protection
    public/                    Static assets
    plans/                     Product and implementation planning notes
    types/                     Shared TypeScript types

## Rules for future contributors

- Keep production-safe work on a branch; do not experiment directly on main.
- Never trust client-calculated totals or product metadata.
- Keep secrets out of Git, logs, screenshots, and pull requests.
- Update this README when a route, environment variable, data model, or release step changes.
- Prefer small, reversible commits over large rewrites.
- When changing catalog identity, update UI copy, catalog data, validation, pricing, types, and persistence together.

## Near-term product priorities

1. Move production persistence from committed SQLite to managed PostgreSQL.
2. Add a payment provider and fulfillment state machine before serious order volume.
3. Add automated browser tests for browse → cart → checkout → dashboard.
4. Resolve the broth/soap product-direction split in one deliberate migration.
5. Add observability for failed checkouts and deployment regressions.

## License

MIT

**ZEVA_Jee G — crafted with intention.**
