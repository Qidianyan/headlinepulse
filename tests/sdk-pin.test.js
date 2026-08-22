import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

function parseMinor(spec) {
  const m = String(spec).replace(/^[^\d]*/, "").split(".");
  return { major: Number(m[0]), minor: Number(m[1]) };
}

test("pins @somnia-chain/markets-sdk at 0.25.0 or newer", function () {
  const pkg = JSON.parse(fs.readFileSync(path.join(root, "package.json"), "utf8"));
  const spec = pkg.dependencies["@somnia-chain/markets-sdk"];
  assert.ok(spec, "markets-sdk must be a dependency");
  const v = parseMinor(spec);
  assert.ok(v.major > 0 || v.minor >= 25, spec + " is below 0.25.0");
});

test("Event Contract writes do not use the spot HTTP API", function () {
  const files = [
    "src/adapter/create-exchange.js",
    "src/adapter/load-windows.js",
    "src/adapter/orders.js",
    "src/adapter/redeem.js",
    "src/agent/run-agent.js",
    "src/cli.js",
  ];
  files.forEach(function (rel) {
    const code = fs.readFileSync(path.join(root, rel), "utf8");
    assert.equal(code.includes("/v0/markets"), false, rel);
    assert.equal(code.includes("api.dreamdex.io"), false, rel);
  });
  const create = fs.readFileSync(path.join(root, "src/adapter/create-exchange.js"), "utf8");
  assert.match(create, /SomniaMarkets/);
  assert.match(create, /isBinaryMarket/);
});
