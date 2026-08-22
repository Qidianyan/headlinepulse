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

test("redeem lookup uses the Finalized list, never the live market list", async function () {
  const fake = {
    client: {
      listPastBinaryMarkets: async function (query) {
        assert.equal(query.status, "Finalized");
        return fixture.finalizedList.filter(function (m) {
          return m.status === query.status;
        });
      },
    },
  };
  const past = await HP.listRedeemable(fake);
  const targets = HP.redeemTargets(past, fixture.liveList);
  assert.equal(targets.length, 1);
  assert.equal(targets[0].marketId.endsWith("00ff"), true);
  assert.equal(
    targets.some(function (t) {
      return t.marketId.endsWith("00b1");
    }),
    false,
  );
});

test("dry-run redeem does not invent a transaction hash", async function () {
  const result = await HP.redeemWindow({}, "BTC-22AUG26-1500/TUSDC", 10, { dryRun: true });
  assert.equal(result.dryRun, true);
  assert.equal(result.hash, undefined);
});
