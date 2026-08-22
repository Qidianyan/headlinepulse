import test from "node:test";
import assert from "node:assert/strict";
import { HeadlinePulse as HP } from "../src/core.js";

test("snaps prices onto the tick as integers, not toFixed(18)", function () {
  const snapped = HP.snapPriceToTick(0.6234, "1000", 6);
  assert.equal(HP.toRawInteger(snapped, 6), 623000n);
  assert.equal(HP.isOnTick(snapped, "1000", 6), true);
  assert.equal(HP.priceInOpenUnit(snapped), true);
});

test("clamps binary prices inside (0, 1) on the tick grid", function () {
  const low = HP.snapPriceToTick(0, "1000", 6);
  const high = HP.snapPriceToTick(1, "1000", 6);
  assert.equal(HP.toRawInteger(low, 6), 1000n);
  assert.equal(HP.toRawInteger(high, 6), 999000n);
});

test("snaps quantity down onto the lot grid", function () {
  assert.equal(HP.snapQtyToLot(10.9, "1000000", 6), 10);
  assert.equal(HP.snapQtyToLot(0.4, "1000000", 6), 0);
  assert.equal(HP.isOnLot(10, "1000000", 6), true);
});

test("Down price is the integer complement of Up", function () {
  const up = HP.snapPriceToTick(0.56, "1000", 6);
  const down = HP.downPriceFromUp(up, 6);
  const one = 10n ** 6n;
  assert.equal(HP.toRawInteger(down, 6), one - HP.toRawInteger(up, 6));
});

test("18-decimal venues snap without float toFixed residue", function () {
  const tick = 10n ** 15n;
  const snapped = HP.snapPriceToTick(0.05, tick.toString(), 18);
  const raw = HP.toRawInteger(snapped, 18);
  assert.equal(raw % tick, 0n);
  assert.equal(raw, 5n * 10n ** 16n);
});
