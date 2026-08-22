import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { HeadlinePulse as HP } from "../src/core.js";

const fixture = JSON.parse(
  fs.readFileSync(
    path.join(path.dirname(fileURLToPath(import.meta.url)), "fixtures", "markets.json"),
    "utf8",
  ),
);

test("loadWindows maps SDK-shaped binary rows and keys by marketId", async function () {
  const fake = {
    loadMarkets: async function () {
      return fixture.unified;
    },
    client: {
      getMarketOnchain: async function (marketId) {
        assert.match(marketId, /^0x/);
        return { status: 1, finalized: false };
      },
    },
    fetchOrderBook: async function (symbol) {
      assert.equal(symbol.endsWith("#YES"), true);
      return { bids: [[0.54, 12]], asks: [[0.56, 9]] };
    },
  };
  const windows = await HP.loadWindows(fake, {
    isBinaryMarket: function (info) {
      return info.marketType === "BINARY";
    },
  });
  assert.equal(windows.length, 1);
  assert.equal(windows[0].marketId.endsWith("00b1"), true);
  assert.equal(windows[0].onchainStatus, 1);
  assert.equal(windows[0].upAsk, 0.56);
  assert.notEqual(windows[0].marketId, windows[0].poolAddress);
});

test("placeIntent stays dry-run unless explicitly live", async function () {
  const intent = HP.mapNewsToIntent(
    fixture.news,
    fixture.windows,
    fixture.nowSec,
    { stake: 10 },
  );
  const placed = await HP.placeIntent({}, intent, { dryRun: true });
  assert.equal(placed.dryRun, true);
  assert.equal(placed.order, undefined);
});

test("placeIntent refuses writes when on-chain status is not Trading", async function () {
  const intent = HP.mapNewsToIntent(
    fixture.news,
    fixture.windows,
    fixture.nowSec,
    { stake: 10 },
  );
  intent.onchainStatus = HP.ONCHAIN_LOCKED;
  const placed = await HP.placeIntent(
    { createOrder: async function () { throw new Error("should not send"); } },
    intent,
    { dryRun: false },
  );
  assert.equal(placed.ok, false);
  assert.equal(placed.reason, "not-trading");
});
