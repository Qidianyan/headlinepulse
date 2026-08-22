#!/usr/bin/env node
import { createExchange, discoverLiveWindows } from "./adapter/create-exchange.js";

const HARD_MS = 8000;
setTimeout(function () {
  console.log(
    JSON.stringify({
      ok: false,
      error: "Shannon discover hard-timeout after " + HARD_MS + "ms",
      hint: "Shannon RPC or the DreamDEX indexer was unreachable. Dry-run + fixtures still work.",
    }),
  );
  process.exit(1);
}, HARD_MS);

function withTimeout(promise, ms) {
  return new Promise(function (resolve, reject) {
    const timer = setTimeout(function () {
      reject(new Error("Shannon discover timed out after " + ms + "ms"));
    }, ms);
    promise.then(
      function (value) {
        clearTimeout(timer);
        resolve(value);
      },
      function (err) {
        clearTimeout(timer);
        reject(err);
      },
    );
  });
}

let exchange;
try {
  exchange = createExchange({
    signal: AbortSignal.timeout(HARD_MS),
  });
  const windows = await withTimeout(discoverLiveWindows(exchange), 10000);
  const sample = windows.slice(0, 8).map(function (w) {
    return {
      marketId: w.marketId,
      symbol: w.symbol,
      asset: w.asset,
      cadence: w.cadence,
      onchainStatus: w.onchainStatus,
      upBid: w.upBid,
      upAsk: w.upAsk,
    };
  });
  console.log(JSON.stringify({ ok: true, count: windows.length, sample: sample }, null, 2));
  process.exit(0);
} catch (err) {
  console.log(
    JSON.stringify(
      {
        ok: false,
        error: String(err && err.message ? err.message : err),
        hint: "Shannon RPC or the DreamDEX indexer was unreachable. Dry-run + fixtures still work.",
      },
      null,
      2,
    ),
  );
  process.exit(1);
}
