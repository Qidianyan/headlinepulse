(function (g) {
  const HP = (g.HeadlinePulse = g.HeadlinePulse || {});

  function midUpPrice(window) {
    const bid = window.upBid;
    const ask = window.upAsk;
    if (typeof bid === "number" && typeof ask === "number") return (bid + ask) / 2;
    if (typeof ask === "number") return ask;
    if (typeof bid === "number") return bid;
    return 0.5;
  }

  HP.buildOrderIntent = function buildOrderIntent(policy, window, stake) {
    const decimals = window.quoteDecimals || HP.DEFAULT_DECIMALS;
    const tickRaw = window.tickRaw || HP.DEFAULT_TICK_RAW;
    const lotRaw = window.lotRaw || HP.DEFAULT_LOT_RAW;
    const upPrice = HP.snapPriceToTick(midUpPrice(window), tickRaw, decimals);
    const downPrice = HP.downPriceFromUp(upPrice, decimals);
    const quantity = HP.sizeFromConfidence(stake || HP.DEFAULT_STAKE, policy.confidence, lotRaw, decimals);
    if (!quantity) return { ok: false, reason: "qty-below-lot", policy: policy };
    const side = policy.side === "Down" ? "Down" : "Up";
    return HP.intentRecord(policy, window, side, upPrice, downPrice, quantity);
  };

  HP.intentRecord = function intentRecord(policy, window, side, upPrice, downPrice, quantity) {
    return {
      ok: true,
      side: side,
      marketId: window.marketId,
      symbol: side === "Up" ? window.upSymbol : window.downSymbol,
      marketSymbol: window.symbol,
      upSymbol: window.upSymbol,
      downSymbol: window.downSymbol,
      price: side === "Up" ? upPrice : downPrice,
      upPrice: upPrice,
      downPrice: downPrice,
      quantity: quantity,
      confidence: policy.confidence,
      asset: policy.asset,
      cadence: window.cadence,
      rationale: policy.rationale,
      hits: policy.hits,
      dryRun: true,
      onchainStatus: window.onchainStatus,
    };
  };

  HP.mapNewsToIntent = function mapNewsToIntent(news, windows, nowSec, opts) {
    const options = opts || {};
    const policy = HP.interpretNews(news);
    const window = HP.selectTradableWindow(windows, policy.asset, nowSec, options);
    if (!window) return { ok: false, reason: "no-trading-window", policy: policy };
    return HP.buildOrderIntent(policy, window, options.stake);
  };
})(typeof window !== "undefined" ? window : globalThis);
