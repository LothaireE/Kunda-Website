# KÜNDA

Astro website with a newsletter form backed by the Squarespace Contacts API.

## Setup

```sh
npm install
cp .env.example .env
```

Set `SQUARESPACE_API_KEY` in `.env` using a key with **Contacts: Read and Write** permission. Your Squarespace plan must support this access. Keep the key server-side; `.env` is ignored by Git. Restart the server after changing it.

## Development

```sh
npm run dev -- --background
npm run astro -- dev status
npm run astro -- dev logs
npm run astro -- dev stop
npm test
npm run build
```

Tests mock Squarespace and create no real contacts.

## Newsletter

`POST /api/newsletter` validates submissions and creates Squarespace contacts with marketing consent. Existing subscribers receive a success message; unsubscribed contacts are never automatically reactivated.

This does not submit the existing Squarespace newsletter block, select a named mailing list, or send a confirmation email. Before launch, verify a real signup and campaign targeting in Squarespace, and configure rate limiting for the endpoint.

## Deployment

The Node adapter serves the API while the homepage is prerendered:

```sh
node --env-file=.env dist/server/entry.mjs
```

Static-only hosting is insufficient. Netlify or Cloudflare deployments require the matching Astro adapter and the API key configured as a server environment variable.

[Squarespace Contacts API](https://developers.squarespace.com/commerce-apis/contacts) · [API permissions](https://developers.squarespace.com/commerce-apis/authentication-and-permissions)
