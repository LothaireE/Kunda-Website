import { subscribe } from "@/server/newsletter";
export const runtime = "nodejs";
export function POST(request: Request) {
  // Next may construct request.url with the server's internal hostname. Use the
  // incoming Host so the existing same-origin check also works behind the router.
  const url = new URL(request.url);
  const host = request.headers.get("host");
  if (host) url.host = host;
  return subscribe(new Request(url, request), {
    apiKey: process.env.SQUARESPACE_API_KEY,
  });
}
function methodNotAllowed() {
  return new Response(null, {
    status: 405,
    headers: { Allow: "POST", "Cache-Control": "no-store" },
  });
}
export {
  methodNotAllowed as GET,
  methodNotAllowed as PUT,
  methodNotAllowed as PATCH,
  methodNotAllowed as DELETE,
  methodNotAllowed as HEAD,
  methodNotAllowed as OPTIONS,
};
