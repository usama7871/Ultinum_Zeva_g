# ZIVA G — Artisanal Broths

ZIVA G is a Next.js App Router storefront for curated broth tasting boxes. The application includes a glassmorphic tasting room, Clerk authentication, a persistent per-user cart, SQLite/Prisma order storage, a member dashboard, and public tasting reviews.

## Stack

- Next.js 16 with App Router and Turbopack
- TypeScript with strict checking
- Tailwind CSS v4
- Clerk for authentication
- Prisma 5 with SQLite for local development
- Framer Motion and Lucide React for interaction and UI

## Local setup

1. Install dependencies:

   ```bash
   npm install
   ```

2. Copy the example environment file to `.env.local` and add the Clerk values from the Clerk Dashboard **API Keys** page:

   ```text
   DATABASE_URL="file:./dev.db"
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
   CLERK_SECRET_KEY=sk_test_...
   NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
   NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
   NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
   NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
   ```

   Never commit `.env.local` or expose `CLERK_SECRET_KEY` in client code.

3. Generate Prisma Client and sync the local database:

   ```bash
   npx prisma generate
   npx prisma db push
   ```

4. Start development:

   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000).

## Authentication

The root provider is configured in [app/layout.tsx](app/layout.tsx). The Clerk proxy in [proxy.ts](proxy.ts) protects `/dashboard` and includes Clerk’s internal `__clerk` path. Authentication pages are `/sign-in`, `/sign-up`, and `/dashboard`.

The navigation displays sign-in and sign-up actions for visitors. Authenticated users receive a profile menu containing their Clerk photo, name, email, cart summary, recent orders, member portal link, and sign-out action.

The database uses `User.clerkId` as the stable identity key. A local user record is created or updated when an authenticated user checks out, submits a review, or accesses the persistent cart API.

## Database structure

The schema lives in [prisma/schema.prisma](prisma/schema.prisma):

- `User` stores the Clerk ID, email, display name, membership tier, and relations.
- `Cart` stores one persistent cart per user.
- `CartItem` stores a validated broth ID, display name, and quantity.
- `Order` stores checkout information, server-calculated price, status, shipping address, owner, and creation time.
- `OrderItem` stores the immutable flavor name and quantity purchased with an order.
- `Review` stores public tasting notes and optionally links them to the authenticated reviewer.

Useful database commands:

```bash
npx prisma studio
npx prisma generate
npx prisma db push
```

For production, replace SQLite with managed PostgreSQL and use a reviewed Prisma migration process rather than relying on `db push`.

## Commerce logic

### Cart

- The landing page keeps cart interactions instant in client state.
- Authenticated carts synchronize with `/api/cart` and persist in `Cart`/`CartItem`.
- Cart items are limited to the server-owned catalog in [lib/catalog.ts](lib/catalog.ts).
- Invalid flavor IDs, zero quantities, and quantities above eight are discarded by the API.
- Visitors without Clerk credentials can still curate a temporary client-side box, but only authenticated users receive cross-device persistence.

### Orders

Checkout is handled by `POST /api/orders` from [components/TastingBoxDrawer.tsx](components/TastingBoxDrawer.tsx).

- The server validates the box tier and every flavor.
- The server calculates the price: 4-pack is `$68`; 8-pack is `$118`.
- The client cannot override the final price.
- The server rejects empty boxes and boxes over their capacity.
- Authenticated orders are linked to the Clerk user’s local `User` record.
- `GET /api/orders` returns only the current authenticated user’s orders.
- The dashboard reads this endpoint and calculates delivered jar, spend, and collagen estimates from stored order items.

### Reviews

`GET /api/reviews` returns the public tasting feed. `POST /api/reviews` validates author, flavor, comment, a rating from 1 to 5, and reasonable field lengths. Authenticated reviews are linked to the current `User`; public reviews remain visible to all visitors.

## API routes

- `GET/POST /api/orders` — user-scoped order history and validated checkout
- `GET/PUT /api/cart` — authenticated persistent cart
- `GET/POST /api/reviews` — public review feed and validated review submission

## Verification

Run these before opening a pull request:

```bash
npx tsc --noEmit
npm run lint
npm run build
```

If Prisma reports a Windows `EPERM` error while regenerating the client, stop the running Next.js/Node process, then run `npx prisma generate` again. This happens when the SQLite query engine is locked by a running development server.

## Production checklist

- Add Clerk production keys in the deployment provider, not in Git.
- Configure Clerk allowed redirect/origin URLs for the production domain.
- Move `DATABASE_URL` to managed PostgreSQL.
- Run Prisma migrations in the deployment pipeline.
- Replace demo review fallback content with a deliberate seed/review moderation strategy.
- Add payment authorization before treating an order as paid; the current flow records a tasting-box order but does not charge a payment provider.
- Add rate limiting and abuse protection to public review submission.
