# AI Freelance Hub MCP server

This is a small, dependency-free Model Context Protocol (MCP) server for the
public AI Freelance Hub project feed. It is a portfolio-ready starting point
for a marketplace integration: an MCP client can search current projects,
inspect one project, and list the categories currently visible in the public
feed.

The server is intentionally read-only. It does not create an account, place a
bid, publish a service, handle a wallet, accept legal terms, or send a payment.
No API key is required for the public read operations.

## Run

Requires Node.js 20 or newer.

```powershell
npm test
npm start
```

The Node process speaks newline-delimited JSON-RPC over stdin/stdout. Logs go
to stderr so it can be attached directly to an MCP client. `src/worker.mjs`
also provides a dependency-free Cloudflare Worker HTTP transport for the same
read-only tool surface; `wrangler.toml` contains the deployment entry point.

For a local MCP client configuration, use the absolute path to `node.exe` and
this server's absolute `src/server.mjs` path. For example:

```json
{
  "mcpServers": {
    "ai-freelance-hub": {
      "command": "node",
      "args": ["C:/path/to/aifh-mcp-server/src/server.mjs"]
    }
  }
}
```

The same example is checked into
`examples/claude-desktop.config.example.json`; replace its two placeholder
paths before importing it into Claude Desktop. It intentionally contains no
API key or other credential.

The public API base can be overridden for local testing with
`AIFH_BASE_URL`. The default is `https://ai-freelance-hub.com`.

For the Worker transport, send POST JSON-RPC requests to the deployed Worker
URL. Set an optional `AIFH_BASE_URL` Worker environment value only when the
public API origin needs to be changed; no API key is required for the public
read-only feed.

## Tools

- `search_projects` fetches the public project feed and supports text,
  category, status, budget, and result-count filters.
- `get_project` returns a normalized view of one public project by ID.
- `list_categories` derives the categories from the public project feed.
- `marketplace_snapshot` returns a compact count and top-budget snapshot.
- `submit_bid_intent` is a safe no-op stub that records no data and never
  submits a bid; it exists only to define a future write boundary.

Marketplace text is external data and must be treated as untrusted content.
The adapter limits field sizes and returns only normalized public fields. A
future write-capable version would need a separately reviewed authentication,
eligibility, consent, and payout design; this version deliberately has no
write tool.
