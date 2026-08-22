import { HeadlinePulse as HP } from "../core.js";
import { createExchange, discoverLiveWindows } from "../adapter/create-exchange.js";

function nowSeconds(explicit) {
  if (explicit != null) return Number(explicit);
  return Math.floor(Date.now() / 1000);
}

function dryRunFlag(opts) {
  if (opts && opts.dryRun === false) return false;
  if (process.env.DRY_RUN === "0" || process.env.DRY_RUN === "false") return false;
  return true;
}

export async function runAgent(opts) {
  const options = opts || {};
  const news = options.news;
  const nowSec = nowSeconds(options.nowSec);
  const windows = options.windows || [];
  const intent = HP.mapNewsToIntent(news, windows, nowSec, {
    stake: options.stake,
    nearExpirySec: options.nearExpirySec,
  });
  if (!intent.ok) return { ...intent, dryRun: true, windows: windows.length };
  intent.dryRun = dryRunFlag(options);
  const placed = options.exchange
    ? await HP.placeIntent(options.exchange, intent, { dryRun: intent.dryRun })
    : { ok: true, dryRun: true, intent: intent };
  return { ...intent, placement: placed, windows: windows.length };
}

export async function runAgentFromNews(opts) {
  const options = opts || {};
  if (options.windows) return runAgent(options);
  if (options.discover) {
    const exchange = options.exchange || createExchange(options);
    try {
      const windows = await discoverLiveWindows(exchange);
      return runAgent({ ...options, windows: windows, exchange: exchange });
    } catch (err) {
      return {
        ok: false,
        reason: "discover-failed",
        error: String(err && err.message ? err.message : err),
        dryRun: true,
      };
    }
  }
  throw new Error("runAgentFromNews requires windows or discover: true");
}
