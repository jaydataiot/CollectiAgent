const UPSTREAM_ORIGIN = "https://collecti-agent.replit.app";

export async function onRequest(context) {
  return proxyToUpstream(context, UPSTREAM_ORIGIN);
}

async function proxyToUpstream({ request, params }) {
  if (request.method === "OPTIONS") {
    return new Response(null, {
      status: 204,
      headers: { Allow: "GET, HEAD, POST, PATCH, DELETE, OPTIONS" },
    });
  }

  if (!["GET", "HEAD", "POST", "PATCH", "DELETE"].includes(request.method)) {
    return new Response("Method Not Allowed", {
      status: 405,
      headers: { Allow: "GET, HEAD, POST, PATCH, DELETE, OPTIONS" },
    });
  }

  const suffix = Array.isArray(params.path) ? params.path.join("/") : params.path || "";
  const incomingUrl = new URL(request.url);
  const targetUrl = new URL(`/api/${suffix}`, UPSTREAM_ORIGIN);
  targetUrl.search = incomingUrl.search;

  const headers = new Headers(request.headers);
  headers.set("Origin", UPSTREAM_ORIGIN);
  headers.set("Referer", `${UPSTREAM_ORIGIN}/`);
  headers.delete("Host");
  headers.delete("CF-Connecting-IP");
  headers.delete("CF-IPCountry");
  headers.delete("CF-Ray");
  headers.delete("X-Forwarded-For");

  try {
    const upstream = await fetch(
      new Request(targetUrl, {
        method: request.method,
        headers,
        body: request.method === "GET" || request.method === "HEAD" ? undefined : request.body,
        redirect: "manual",
      }),
    );

    const responseHeaders = new Headers(upstream.headers);
    responseHeaders.set("Cache-Control", "no-store");
    responseHeaders.set("X-Collecti-Upstream", "agent");
    return new Response(upstream.body, {
      status: upstream.status,
      statusText: upstream.statusText,
      headers: responseHeaders,
    });
  } catch (error) {
    console.error(JSON.stringify({ event: "agent_proxy_failure", message: String(error) }));
    return Response.json(
      { error: "CollectiAgent is temporarily unavailable." },
      { status: 502, headers: { "Cache-Control": "no-store" } },
    );
  }
}
