import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { HeadlinePulse as HP } from "../src/core.js";
import { runAgent } from "../src/agent/run-agent.js";

const fixture = JSON.parse(
  fs.readFileSync(
    path.join(path.dirname(fileURLToPath(import.meta.url)), "fixtures", "markets.json"),
    "utf8",
  ),
);

const BTC_NEWS = "Bitcoin ETF inflows hit a record as BTC breaks out above resistance";
const ETH_NEWS = "Ethereum faces SEC delay as ETH selloff deepens after a bridge hack";

function assertIntentShape(intent) {
  assert.equal(intent.ok, true);
  assert.ok(intent.side === "Up" || intent.side === "Down");
  assert.ok(intent.marketId && intent.marketId.startsWith("0x"));
  assert.ok(intent.symbol && intent.symbol.length > 0);
  assert.equal(HP.priceInOpenUnit(intent.price), true);
  assert.equal(HP.priceInOpenUnit(intent.upPrice), true);
  assert.equal(HP.isOnTick(intent.upPrice, "1000", 6), true);
  assert.equal(HP.isOnLot(intent.quantity, "1000000", 6), true);
  const one = 10n ** 6n;
  assert.equal(
    HP.toRawInteger(intent.downPrice, 6),
    one - HP.toRawInteger(intent.upPrice, 6),
  );
}

test("mapNewsToIntent turns a BTC headline into a sized Event Contract order", function () {
  const intent = HP.mapNewsToIntent(BTC_NEWS, fixture.windows, fixture.nowSec, {
    stake: 10,
  });
  assertIntentShape(intent);
  assert.equal(intent.side, "Up");
  assert.equal(intent.marketId.endsWith("00b1"), true);
  assert.equal(intent.symbol.endsWith("#YES"), true);
  assert.equal(intent.marketId.endsWith("00b2"), false);
});

test("bearish ETH news buys Down on the tradable ETH window, not the dying one", function () {
  const intent = HP.mapNewsToIntent(ETH_NEWS, fixture.windows, fixture.nowSec, {
    stake: 10,
  });
  assertIntentShape(intent);
  assert.equal(intent.side, "Down");
  assert.equal(intent.marketId.endsWith("00e2"), true);
  assert.equal(intent.symbol.endsWith("#NO"), true);
  assert.equal(intent.marketId.endsWith("00e1"), false);
});

test("runAgent (shipped entry) returns the same primary fields as the mapper", async function () {
  const result = await runAgent({
    news: BTC_NEWS,
    windows: fixture.windows,
    nowSec: fixture.nowSec,
    stake: 10,
    dryRun: true,
  });
  assertIntentShape(result);
  assert.equal(result.dryRun, true);
  assert.equal(result.placement.dryRun, true);
});
