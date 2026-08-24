import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const VIDEO =
  "https://github.com/Qidianyan/headlinepulse/releases/download/demo-2026-08-22/headlinepulse.mp4";
const REPO = "https://github.com/Qidianyan/headlinepulse";

function read(rel) {
  return fs.readFileSync(path.join(root, rel), "utf8");
}

test("README is the GitHub landing: video, repo, test STT, run commands", function () {
  const md = read("README.md");
  assert.match(md, /HeadlinePulse/);
  assert.ok(md.includes(VIDEO), "README must link the 2–3 min demo mp4");
  assert.ok(md.includes(REPO), "README must name the public GitHub repo");
  assert.match(md, /test STT/i);
  assert.match(md, /testnet\.somnia\.network/);
  assert.match(md, /npm test/);
  assert.match(md, /npm run agent/);
  assert.match(md, /npm run ui/);
  assert.match(md, /@somnia-chain\/markets-sdk/);
  assert.match(md, /Trading \(status = 1\)|Trading \(1\)/);
  assert.ok(md.includes("/v0/markets"), "must say we do not use spot HTTP");
  assert.match(md, /not the DreamDEX \*\*spot\*\* HTTP|not the DreamDEX \*\*spot\*\*/i);
});

test("SUBMISSION.md is paste-ready English with the same video URL", function () {
  const md = read("SUBMISSION.md");
  assert.ok(md.includes(VIDEO), "SUBMISSION must carry the demo video URL");
  assert.ok(md.includes(REPO));
  assert.match(md, /A headline in/);
  assert.match(md, /2 min 28 sec|2:28/);
  assert.match(md, /npm test/);
  assert.match(md, /npm run agent/);
  assert.match(md, /npm run ui/);
  assert.match(md, /Problem/);
  assert.match(md, /Solution/);
  assert.match(md, /Product/);
  assert.match(md, /Demonstration|Demo/);
  assert.match(md, /vision/i);
});

test("in-repo demo mp4 exists for judges who clone", function () {
  const mp4 = path.join(root, "demo", "headlinepulse.mp4");
  assert.equal(fs.existsSync(mp4), true);
  assert.ok(fs.statSync(mp4).size > 100000, "mp4 too small to be the walkthrough");
});
