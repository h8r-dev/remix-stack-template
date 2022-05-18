/**
 * Manually create errors.
 */

import type { LoaderFunction } from "@remix-run/node";
import { Counter } from "prom-client"

let err500Counter: any = null

if (process.env.NODE_ENV === 'production') {
  err500Counter = new Counter({
    name: 'remix_error_500_count_total',
    help: 'Records total 500 responses of Application service',
  })
}

export const loader: LoaderFunction = async ({ request }) => {
  const err: unknown = new Error('Manually create errors.')
  console.log("Metrics error: ❌", { error: err });

  if (err500Counter !== null) {
    await err500Counter.inc()
  }

  return new Response("Metrics ERROR", { status: 500 });
};