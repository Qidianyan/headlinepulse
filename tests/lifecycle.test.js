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

test("skips non-Trading on-chain status even if the indexer still lists it", function () {
  const locked = fixture.windows.find(function (w) {
    return w.marketId.endsWith("00b2");
  });
  assert.equal(HP.isOnchainTrading(locked), false);
  assert.equal(HP.isTradableWindow(locked, fixture.nowSec), false);
});

test("skips windows inside the near-expiry buffer", function () {
  const dying = fixture.windows.find(function (w) {
    return w.marketId.endsWith("00e1");
  });
  assert.equal(HP.isOnchainTrading(dying), true);
  assert.equal(HP.isNearExpiry(dying, fixture.nowSec, 30), true);
  assert.equal(HP.isTradableWindow(dying, fixture.nowSec, 30), false);
});

test("selects the soonest still-tradable window for the asset", function () {
  const btc = HP.selectTradableWindow(fixture.windows, "BTC", fixture.nowSec);
  assert.equal(btc.marketId.endsWith("00b1"), true);
  const eth = HP.selectTradableWindow(fixture.windows, "ETH", fixture.nowSec);
  assert.equal(eth.marketId.endsWith("00e2"), true);
});
