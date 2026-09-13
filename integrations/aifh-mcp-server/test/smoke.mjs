import assert from "node:assert/strict";
import { createServer } from "node:http";
import { once } from "node:events";
import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sample = {
  projects: [
    {
      id: "demo-mcp",
      title: "Build an MCP server",
      description: "Expose a public API through MCP.",
      category: "development",
      skills: ["MCP", "TypeScript"],
      budget: { min: 300, max: 500, currency: "USD" },
      status: "open",
      deadline: "2099-01-01",
      bidsCount: 0
    },
    {
      id: "demo-seo",
      title: "Technical SEO",
      category: "marketing",
      budget: "$200-$400",
      status: "closed"
    }
  ]
};

const api = createServer((request, response) => {
  if (request.url === "/api/agent/v1/projects") {
    response.writeHead(200, { "content-type": "application/json" });
    response.end(JSON.stringify(sample));
    return;
  }
  response.writeHead(404);
  response.end();
});
api.listen(0, "127.0.0.1");
await once(api, "listening");
const address = api.address();
const baseUrl = `http://127.0.0.1:${address.port}`;

const child = spawn(process.execPath, [resolve(root, "src/server.mjs")], {
  cwd: root,
  env: { ...process.env, AIFH_BASE_URL: baseUrl },
  stdio: ["pipe", "pipe", "pipe"]
});
let buffer = "";
const pending = new Map();
child.stdout.setEncoding("utf8");
child.stdout.on("data", (chunk) => {
  buffer += chunk;
  const lines = buffer.split(/\r?\n/);
  buffer = lines.pop() || "";
  for (const line of lines) {
    if (!line.trim()) continue;
    const message = JSON.parse(line);
    const waiter = pending.get(message.id);
    if (waiter) {
      pending.delete(message.id);
      waiter(message);
    }
  }
});

let nextId = 1;
function call(method, params = {}) {
  const id = nextId++;
  return new Promise((resolveCall, rejectCall) => {
    const timer = setTimeout(() => {
      pending.delete(id);
      rejectCall(new Error(`Timed out waiting for ${method}`));
    }, 5000);
    pending.set(id, (message) => {
      clearTimeout(timer);
      resolveCall(message);
    });
    child.stdin.write(`${JSON.stringify({ jsonrpc: "2.0", id, method, params })}\n`);
  });
}

try {
  const initialized = await call("initialize", { protocolVersion: "2025-03-26", capabilities: {}, clientInfo: { name: "smoke", version: "1" } });
  assert.equal(initialized.result.serverInfo.name, "luna-aifh-mcp");

  const tools = await call("tools/list");
  assert.equal(tools.result.tools.length, 5);

  const search = await call("tools/call", { name: "search_projects", arguments: { query: "MCP", minBudgetUsd: 450 } });
  const searchData = JSON.parse(search.result.content[0].text);
  assert.equal(searchData.count, 1);
  assert.equal(searchData.projects[0].id, "demo-mcp");

  const project = await call("tools/call", { name: "get_project", arguments: { id: "demo-seo" } });
  assert.equal(project.result.structuredContent.project.budget.min, 200);

  const categories = await call("tools/call", { name: "list_categories", arguments: {} });
  assert.deepEqual(categories.result.structuredContent.categories, ["development", "marketing"]);

  const stub = await call("tools/call", { name: "submit_bid_intent", arguments: { id: "demo-mcp" } });
  assert.equal(stub.result.structuredContent.accepted, false);
  assert.equal(stub.result.structuredContent.status, "stub_only_read_only");

  console.log("AIFH MCP smoke test passed");
} finally {
  child.kill();
  api.close();
}
