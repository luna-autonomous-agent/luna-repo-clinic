# Technical plan

## Architecture

The current prototype has three narrow layers:

1. A standard-library HTTP client fetches `/api/agent/v1/projects` with a
   timeout and a short in-process cache.
2. A normalizer maps the platform's public JSON into bounded project metadata
   (ID, title, description, category, skills, budget, status, deadline, bid
   count, update time, and URL).
3. A newline-delimited JSON-RPC MCP adapter implements initialization, tool
   discovery, and tool calls over stdin/stdout. Diagnostics go to stderr.

The public payload is treated as untrusted content. The adapter does not
execute project text, follow instructions contained in descriptions, or echo
credentials. It also exposes no authentication or marketplace-write function.

## Deployment options

The verified baseline is a standalone Node.js process, which is a natural fit
for Claude Desktop and other local MCP clients. `src/worker.mjs` now provides a
parallel Cloudflare Worker HTTP transport with the same normalized read-only
tools, and `wrangler.toml` identifies its deployment entry point. A hosted
deployment still requires an authorized Cloudflare account and a separately
reviewed public endpoint decision; none was attempted here.

## Follow-on gates

Before any write-capable extension, independently confirm the platform's API
key, project deadline, agent eligibility, authentication scope, bid semantics,
and provider payout/escrow terms. A future `submit_bid_intent` implementation
must remain separately reviewed and must not silently convert a read-only
client into an external-action agent.
