(function (g) {
  const HP = (g.HeadlinePulse = g.HeadlinePulse || {});

  function cadenceOf(info) {
    if (info.interval) return info.interval;
    const sec = Number(info.intervalSec || 0);
    if (sec === 900) return "15m";
    if (sec === 3600) return "1h";
    if (sec === 14400) return "4h";
    if (sec === 86400) return "24h";
    return sec ? sec + "s" : "15m";
  }

  HP.toBinaryWindow = function toBinaryWindow(unified, onchain, book, grid) {
    const info = unified.info || {};
    const outcomes = unified.outcomes || [];
    const up = outcomes[0] || {};
    const down = outcomes[1] || {};
    const g = grid || {};
    return {
      marketId: info.marketId || unified.id,
      symbol: unified.symbol,
      upSymbol: up.symbol,
      downSymbol: down.symbol,
      asset: info.asset,
      cadence: cadenceOf(info),
      question: info.question,
      expirySec: Number(info.expiry),
      tradingStartSec: Number(info.tradingStart),
      onchainStatus: Number(onchain.status),
      indexerStatus: info.status,
      upBid: book && book.bids && book.bids[0] ? book.bids[0][0] : null,
      upAsk: book && book.asks && book.asks[0] ? book.asks[0][0] : null,
      tickRaw: String(g.tickRaw || HP.DEFAULT_TICK_RAW),
      lotRaw: String(g.lotRaw || HP.DEFAULT_LOT_RAW),
      minQtyRaw: String(g.minQtyRaw || g.lotRaw || HP.DEFAULT_LOT_RAW),
      quoteDecimals: Number(info.quoteDecimals || g.quoteDecimals || HP.DEFAULT_DECIMALS),
      poolAddress: info.poolAddress,
      nonce: info.nonce,
    };
  };
})(typeof window !== "undefined" ? window : globalThis);
