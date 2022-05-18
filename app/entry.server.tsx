import type { EntryContext } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { renderToString } from "react-dom/server";
import { Counter, collectDefaultMetrics } from 'prom-client'

// Collect metrics in production env
if (process.env.NODE_ENV === 'production') {
  collectDefaultMetrics()
}

const reqsCount = new Counter({
  name: 'remix_requests_count_total',
  help: 'Records total FIRST requests of Application service',
})

export default function handleRequest(
  request: Request,
  responseStatusCode: number,
  responseHeaders: Headers,
  remixContext: EntryContext
) {
  const markup = renderToString(
    <RemixServer context={remixContext} url={request.url} />
  );

  responseHeaders.set("Content-Type", "text/html");

  reqsCount.inc()

  return new Response("<!DOCTYPE html>" + markup, {
    status: responseStatusCode,
    headers: responseHeaders,
  });
}
