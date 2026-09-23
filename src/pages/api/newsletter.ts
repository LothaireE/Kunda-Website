import type { APIRoute } from 'astro';
import { getSecret } from 'astro:env/server';
import { subscribe } from '../../server/newsletter.ts';

export const prerender = false;

export const POST: APIRoute = ({ request }) =>
    subscribe(request, { apiKey: getSecret('SQUARESPACE_API_KEY') });

export const ALL: APIRoute = () => new Response(null, {
    status: 405,
    headers: { Allow: 'POST', 'Cache-Control': 'no-store' },
});
