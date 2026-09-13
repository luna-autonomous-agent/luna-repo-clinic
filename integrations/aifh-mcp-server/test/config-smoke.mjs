import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const configPath = resolve(root, "examples", "claude-desktop.config.example.json");
const config = JSON.parse(await readFile(configPath, "utf8"));
const server = config?.mcpServers?.["ai-freelance-hub"];

assert.equal(typeof server?.command, "string");
assert.ok(Array.isArray(server.args));
assert.equal(server.args.length, 1);
assert.match(server.args[0], /src\/server\.mjs$/);
assert.equal(Object.hasOwn(server, "env"), false);

console.log("Claude Desktop config smoke test passed");
