import { handleRequest } from "../src/server.mjs";

const reply = await handleRequest({
  jsonrpc: "2.0",
  id: 1,
  method: "tools/call",
  params: { name: "search_projects", arguments: { query: "MCP", limit: 5, refresh: true } }
});

if (!reply?.result?.content?.[0]?.text) throw new Error("Unexpected MCP response");
const data = JSON.parse(reply.result.content[0].text);
console.log(JSON.stringify({
  count: data.count,
  projects: data.projects.map((project) => ({
    id: project.id,
    title: project.title,
    budget: project.budget,
    status: project.status,
    deadline: project.deadline,
    bidsCount: project.bidsCount
  }))
}, null, 2));
