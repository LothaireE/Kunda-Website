# KÜNDA

Next.js App Router website, migrated from Astro. The homepage photo mosaic, Studio,
Newsletter, About us and Contact pages retain their existing design. The newsletter
still uses the Squarespace Contacts API.

## Setup

Use Node.js 22.12 or newer.

```sh
npm ci
cp .env.example .env
npm run dev
```

Open http://localhost:4321. Configure `SQUARESPACE_API_KEY` server-side in `.env` using
a key with **Contacts: Read and Write** permission. Never expose this key through a
`NEXT_PUBLIC_` variable. Restart the server after changing it.

## Checks

```sh
npm run typecheck
npm run lint
npm run format:check
npm test
npm run build
npx playwright install chromium
npm run test:e2e
```

`npm test` runs React form tests with Vitest / React Testing Library and the retained
server subscription tests with Node's test runner. All external API calls are mocked.
Playwright tests use a production server on port 4322 and cover desktop/mobile
navigation, intro visibility, reduced motion, mocked signup and API validation.
They never create real subscribers.

## Structure

- `src/app/(frontend)`: public pages and their root layout, kept separate from the
  future Payload admin layout.
- `src/app/api/newsletter/route.ts`: server-only subscription endpoint.
- `src/components`: React components and scoped CSS Modules, preserving Astro styles.
- `src/server/newsletter.ts`: framework-independent validation and Squarespace logic.
- `public`: original photos and logos.

Tailwind utilities are available. Preflight is intentionally omitted so its reset
cannot alter the migrated design. Existing components retain CSS Modules.
Next.js and React versions are pinned; check Payload's peer dependencies before upgrades.

## Newsletter

`POST /api/newsletter` validates submissions and creates Squarespace contacts with
marketing consent. Existing subscribers receive a success message; unsubscribed
contacts are never automatically reactivated.

This does not select a named mailing list or send a confirmation email. Before
launch, verify a real signup and campaign targeting in Squarespace, and configure
rate limiting for the endpoint.

## Deployment

```sh
npm run build
npm start
```

Production requires a Node.js runtime and `SQUARESPACE_API_KEY` in the hosting
provider's server environment. Static-only hosting is insufficient for the API.

## Migration scope

The Astro baseline is saved at commit `3fc0918` on
`codex/add-studio-newsletter-about-contact`. Migration work is on `codex/migrate-nextjs`.
The public site is migrated; Payload, PostgreSQL, S3 media storage and Lexical are a
separate next phase and are **not installed or connected yet**. No production
hosting or real subscriber data has been changed.
