import test from 'node:test';
import assert from 'node:assert/strict';
import { subscribe } from '../src/server/newsletter.ts';
const values = { email: 'reader@example.com', firstName: 'Test', lastName: 'Reader', consent: true, website: '' };
function request(body = values, origin = 'https://kunda.test') {
    return new Request('https://kunda.test/api/newsletter', { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: origin }, body: JSON.stringify(body) });
}
const forbiddenFetch = async () => { assert.fail('Must not contact Squarespace'); };
test('invalid fields, consent, origin, and oversized requests cannot reach Squarespace', async () => {
    for (const [body, origin, expected] of [
        [{ ...values, email: 'invalid' }, undefined, 400],
        [{ ...values, firstName: '' }, undefined, 400],
        [{ ...values, consent: false }, undefined, 400],
        [null, undefined, 400], [values, 'https://other.test', 403],
        [{ ...values, lastName: 'x'.repeat(5000) }, undefined, 413],
    ]) assert.equal((await subscribe(request(body, origin), { apiKey: 'test', fetcher: forbiddenFetch })).status, expected);
});
test('honeypot makes no API call', async () => {
    assert.equal((await subscribe(request({ ...values, website: 'spam' }), { fetcher: forbiddenFetch })).status, 200);
});
test('missing credential reports unavailable', async () => {
    assert.equal((await subscribe(request(), { fetcher: forbiddenFetch })).status, 503);
});
test('creates documented contact and consent with private credential', async () => {
    const response = await subscribe(request(), { apiKey: 'test-secret', fetcher: async (url, init) => {
        assert.equal(url, 'https://api.squarespace.com/v1/contacts');
        assert.equal(init.headers.Authorization, 'Bearer test-secret');
        assert.deepEqual(JSON.parse(init.body), { firstName: 'Test', lastName: 'Reader', locale: 'en-US', primaryEmail: { email: 'reader@example.com', acceptsMarketing: true } });
        return Response.json({ contact: { primaryEmail: { acceptsMarketing: { acceptsMarketing: true } } } }, { status: 201 });
    } });
    assert.equal(response.status, 200);
    assert.equal(response.headers.get('cache-control'), 'no-store');
    assert.ok(!(await response.text()).includes('test-secret'));
});
test('unconfirmed marketing status is not reported as success', async () => {
    assert.equal((await subscribe(request(), { apiKey: 'test', fetcher: async () => Response.json({ contact: {} }, { status: 201 }) })).status, 502);
});
test('duplicate subscribers succeed; opted-out contacts stay opted out; fuzzy matches do not count', async () => {
    for (const [email, acceptsMarketing, expected] of [['reader@example.com', true, 200], ['reader@example.com', false, 409], ['other-reader@example.com', true, 409]]) {
        let calls = 0;
        const response = await subscribe(request(), { apiKey: 'test', fetcher: async (url, init) => {
            calls++;
            assert.equal(init.method, 'POST');
            if (calls === 1) return new Response(null, { status: 409 });
            assert.equal(url, 'https://api.squarespace.com/v1/contacts/query');
            return Response.json({ contacts: [{ primaryEmail: { email, acceptsMarketing: { acceptsMarketing } } }] });
        } });
        assert.equal(response.status, expected);
        assert.equal(calls, 2);
    }
});
test('upstream errors and timeouts allow retry without leaking details', async () => {
    for (const code of [400, 401, 403, 429, 500]) {
        const response = await subscribe(request(), { apiKey: 'test', fetcher: async () => new Response('private detail', { status: code }) });
        assert.equal(response.status, code === 429 ? 429 : 503);
        assert.ok(!(await response.text()).includes('private detail'));
    }
    assert.equal((await subscribe(request(), { apiKey: 'test', fetcher: async () => { throw new DOMException('timeout', 'TimeoutError'); } })).status, 503);
});
