const API = 'https://api.squarespace.com/v1/contacts';
const unavailable = 'Sign-up is temporarily unavailable. Please try again later.';
const success = 'Thank you! You are subscribed to the KÜNDA newsletter.';

function reply(status: number, message: string) {
    return Response.json({ message }, {
        status,
        headers: { 'Cache-Control': 'no-store' },
    });
}

export async function subscribe(request: Request, {
    apiKey,
    fetcher = fetch,
}: { apiKey?: string; fetcher?: typeof fetch }): Promise<Response> {
    // The browser submits JSON from this site only. Cross-origin forms cannot
    // use this endpoint to send subscriptions with our private credential.
    if (request.headers.get('origin') !== new URL(request.url).origin) {
        return reply(403, 'Please sign up using the form on this website.');
    }
    if (request.headers.get('content-type')?.split(';')[0] !== 'application/json') {
        return reply(415, 'Please sign up using the form on this website.');
    }

    // Bound the actual stream, including requests without Content-Length.
    const reader = request.body?.getReader();
    if (!reader) return reply(400, 'Please complete the form.');
    let size = 0;
    const chunks: Uint8Array[] = [];
    let body: Record<string, unknown>;
    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            size += value.byteLength;
            if (size > 4096) {
                await reader.cancel();
                return reply(413, 'Please shorten your form entries.');
            }
            chunks.push(value);
        }
        const bytes = new Uint8Array(size);
        let offset = 0;
        for (const chunk of chunks) { bytes.set(chunk, offset); offset += chunk.length; }
        body = JSON.parse(new TextDecoder().decode(bytes));
        if (!body || typeof body !== 'object' || Array.isArray(body)) throw new Error();
    } catch {
        return reply(400, 'Please complete the form and try again.');
    }
    // antispam invisible empty field
    if (body.website) return reply(200, success); // if filled, it's a bot, pretend it worked and do not forward submission to Squarespace
    const email = typeof body.email === 'string' ? body.email.trim() : '';
    const firstName = typeof body.firstName === 'string' ? body.firstName.trim() : '';
    const lastName = typeof body.lastName === 'string' ? body.lastName.trim() : '';
    if (email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return reply(400, 'Please enter a valid email address.');
    }
    if (!firstName || !lastName || firstName.length > 100 || lastName.length > 100) {
        return reply(400, 'Please enter your first and last name (up to 100 characters each).');
    }
    if (body.consent !== true) return reply(400, 'Please confirm that you want to receive the newsletter.');
    if (!apiKey?.trim()) return reply(503, unavailable);

    const headers = {
        Authorization: `Bearer ${apiKey.trim()}`,
        'Content-Type': 'application/json',
        'User-Agent': 'KundaNewsletter/1.0',
    };
    // One deadline across creation and duplicate lookup. Never log addresses,
    // credentials or Squarespace response bodies.
    const signal = AbortSignal.timeout(10_000);
    try {
        const response = await fetcher(API, {
            method: 'POST', headers, signal, redirect: 'error',
            body: JSON.stringify({
                firstName, lastName, locale: 'en-US',
                primaryEmail: { email, acceptsMarketing: true },
            }),
        });
        if (response.status === 201) {
            const result = await response.json();
            if (result.contact?.primaryEmail?.acceptsMarketing?.acceptsMarketing === true) {
                return reply(200, success);
            }
            return reply(502, unavailable);
        }
        if (response.status === 409) {
            const existing = await fetcher(`${API}/query`, {
                method: 'POST', headers, signal, redirect: 'error',
                body: JSON.stringify({ searchString: email, pageSize: 100 }),
            });
            if (!existing.ok) return reply(503, unavailable);
            const result = await existing.json();
            const subscribed = result.contacts?.some((contact: {
                primaryEmail?: { email?: string; acceptsMarketing?: { acceptsMarketing?: boolean } };
            }) => contact.primaryEmail?.email?.toLowerCase() === email.toLowerCase()
                && contact.primaryEmail.acceptsMarketing?.acceptsMarketing === true);
            if (subscribed) return reply(200, success);
            // Never overwrite an existing opt-out or claim it is subscribed.
            return reply(409, 'We could not complete this subscription. Please contact KÜNDA for help.');
        }
        return reply(response.status === 429 ? 429 : 503, unavailable);
    } catch {
        return reply(503, unavailable);
    }
}
