import test from "node:test";
import assert from "node:assert/strict";
import { HeadlinePulse as HP } from "../src/core.js";

test("detects BTC vs ETH from the headline", function () {
  assert.equal(HP.detectAsset("Bitcoin ETF inflows"), "BTC");
  assert.equal(HP.detectAsset("ETH selloff after a hack"), "ETH");
});

test("bullish tape reads Up; bearish tape reads Down", function () {
  const up = HP.interpretNews("BTC rally and ETF inflows hit a record breakout");
  const down = HP.interpretNews("ETH crash and selloff after a hack");
  assert.equal(up.side, "Up");
  assert.equal(down.side, "Down");
  assert.ok(up.confidence >= 0.55 && up.confidence <= 1);
  assert.ok(down.hits.includes("hack") || down.hits.includes("selloff"));
});
