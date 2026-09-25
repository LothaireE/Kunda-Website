## Development

This repository now uses Next.js App Router. Astro commands no longer apply.
Run `npm run dev` on port 4321 in a background process when starting a preview.
Avoid starting multiple servers on the same port; inspect the existing server first.

## Validation

Run `npm run typecheck`, `npm run lint`, `npm test`, and `npm run build` for functional changes.
Use the browser or `npm run test:e2e` to verify interactions and responsive rendering.
Newsletter tests must mock external calls and must not create real subscribers.

## Architecture

Keep the public site in `src/app/(frontend)` to allow a separate Payload admin layout later.
Keep newsletter credentials server-side. Preserve the visual design and hide the
header for the entire photo intro, including after navigation back to the homepage.
Retain the existing scoped CSS while migrating; Tailwind utilities are available.

## Documentation

- Next.js: https://nextjs.org/docs/app
- Payload: https://payloadcms.com/docs

Check Payload compatibility before upgrading Next.js or React.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
