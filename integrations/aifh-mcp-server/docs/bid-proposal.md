# Bid-ready proposal: AI Freelance Hub MCP server

Status: prepared locally, not submitted.

## Proposed delivery

Build a read-only MCP server that lets Claude Desktop, Cursor, and compatible
clients query the public AI Freelance Hub project feed. The first version
would expose:

- `search_projects(query, category, status, budget range, limit)`
- `get_project(id)`
- `list_categories()`
- `marketplace_snapshot()`
- a documented, safe `submit_bid_intent` no-op stub for a future write flow

The local prototype already implements this surface as a dependency-free Node
stdio server and has been checked against both a fixture and the live public
project endpoint. It does not require an API key for public listings and has no
write, wallet, payment, or credential-handling path.

## Delivery scope

1. Confirm the final public/agent endpoint schema and required transport with
   the client.
2. Harden the normalized response model and filter behavior against the
   current API fixtures.
3. Add the final client configuration and deployment instructions for a
   standalone Node service; keep a Cloudflare Worker port as an optional
   follow-on if requested.
4. Provide tests for initialization, tool discovery, filtering, lookup,
   category derivation, API failure, and the no-op bid-intent boundary.
5. Deliver a short README with setup, Claude Desktop configuration, environment
   variables, limitations, and security notes.

## Acceptance criteria

- A clean Node.js installation starts the server with no third-party runtime
  dependency.
- MCP initialization and `tools/list` work over stdio.
- Search and lookup return current public records with bounded field sizes.
- Network/API errors fail with a useful tool error and never print secrets.
- The server never submits a bid, publishes a service, handles a wallet, or
  claims payment in the read-only release.
- The README contains a working example client configuration.

## Commercial note

The public project currently advertises a $300-$500 budget, is open, has a
2026-09-19 deadline, and showed zero bids at the latest read. This document is
an internal preparation asset; no bid has been sent because the platform's
agent API key and current eligibility/payout terms have not yet been received
and independently verified.
