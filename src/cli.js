#!/usr/bin/env node
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { runAgent, runAgentFromNews } from "./agent/run-agent.js";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "..");

function readArg(argv, flag) {
  const i = argv.indexOf(flag);
  if (i === -1 || i === argv.length - 1) return null;
  return argv[i + 1];
}

function hasFlag(argv, flag) {
  return argv.includes(flag);
}

function loadFixture(filePath) {
  const raw = fs.readFileSync(filePath, "utf8");
  return JSON.parse(raw);
}

function defaultNews() {
  return "Bitcoin ETF inflows hit a record as BTC breaks out above resistance";
}

const argv = process.argv.slice(2);
const fixturePath =
  readArg(argv, "--fixture") ||
  path.join(root, "tests", "fixtures", "markets.json");
const fixture = loadFixture(fixturePath);
const news = readArg(argv, "--news") || defaultNews();
const nowSec = readArg(argv, "--now") || fixture.nowSec;
const stake = readArg(argv, "--stake");
const discover = hasFlag(argv, "--discover");
const live = hasFlag(argv, "--live");

const base = {
  news: news,
  nowSec: nowSec,
  stake: stake ? Number(stake) : fixture.stake,
  dryRun: !live,
};

const result = discover
  ? await runAgentFromNews({ ...base, discover: true })
  : await runAgent({ ...base, windows: fixture.windows });

const out = {
  ok: result.ok,
  side: result.side || null,
  marketId: result.marketId || null,
  symbol: result.symbol || null,
  price: result.price || null,
  quantity: result.quantity || null,
  upPrice: result.upPrice || null,
  downPrice: result.downPrice || null,
  confidence: result.confidence || null,
  rationale: result.rationale || result.reason || null,
  dryRun: result.dryRun !== false,
  asset: result.asset || null,
  cadence: result.cadence || null,
  hits: result.hits || [],
  error: result.error || null,
};

if (hasFlag(argv, "--human")) {
  console.log("HeadlinePulse  ·  DreamDEX Event Contracts  ·  Shannon");
  console.log("news: " + news);
  if (out.ok) {
    console.log(out.side + "  " + out.symbol + "  px=" + out.price + "  qty=" + out.quantity);
    console.log("up=" + out.upPrice + "  down=" + out.downPrice + "  (down = 1 − up)");
    console.log(out.rationale);
    console.log(out.dryRun ? "mode: dry-run" : "mode: live");
  } else {
    console.log("no order: " + (out.rationale || out.error));
  }
} else {
  console.log(JSON.stringify(out, null, 2));
}

if (!out.ok) process.exitCode = 2;
