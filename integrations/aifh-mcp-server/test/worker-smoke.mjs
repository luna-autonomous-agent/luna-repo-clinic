import assert from "node:assert/strict";
import { createServer } from "node:http";
import { once } from "node:events";
import worker from "../src/worker.mjs";

const sample = {
  projects: [
    { id: "worker-mcp", title: "Worker MCP", description: "Public API", category: "development", budgetMin: 300, budgetMax: 500, status: "open", deadline: "2099-01-01", bidsCount: 0 }
  ]
};
const api = createServer((_request, response) => {
  response.writeHead(200, { "content-type": "application/json" });
  response.end(JSON.stringify(sample));
});
api.listen(0, "127.0.0.1");
await once(api, "listening");
const address = api.address();
const env = { AIFH_BASE_URL: `http://127.0.0.1:${address.port}` };

async function call(id, method, params = {}) {
  const request = new Request("https://worker.test/mcp", { method: "POST", body: JSON.stringify({ jsonrpc: "2.0", id, method, params }), headers: { "content-type": "application/json" } });
  const response = await worker.fetch(request, env);
  assert.equal(response.status, 200);
  return response.json();
}

try {
  const initialized = await call(1, "initialize");
  assert.equal(initialized.result.serverInfo.name, "luna-aifh-mcp-worker");
  const tools = await call(2, "tools/list");
  assert.equal(tools.result.tools.length, 5);
  const search = await call(3, "tools/call", { name: "search_projects", arguments: { query: "MCP", minBudgetUsd: 450 } });
  assert.equal(search.result.structuredContent.count, 1);
  const stub = await call(4, "tools/call", { name: "submit_bid_intent", arguments: { id: "worker-mcp" } });
  assert.equal(stub.result.structuredContent.accepted, false);
  console.log("AIFH Worker smoke test passed");
} finally {
  api.close();
}
