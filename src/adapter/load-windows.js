(function (g) {
  const HP = (g.HeadlinePulse = g.HeadlinePulse || {});

  function defaultIsBinary(info) {
    return !!(info && info.marketType === "BINARY" && info.marketId);
  }

  HP.loadWindows = async function loadWindows(exchange, deps) {
    const d = deps || {};
    const isBinary = d.isBinaryMarket || defaultIsBinary;
    const markets = Object.values(await exchange.loadMarkets(true));
    const windows = [];
    for (const market of markets) {
      const info = market.info || {};
      if (!market.active || !isBinary(info)) continue;
      const onchain = await exchange.client.getMarketOnchain(info.marketId);
      const upSymbol = market.outcomes && market.outcomes[0] && market.outcomes[0].symbol;
      const book = upSymbol
        ? await exchange.fetchOrderBook(upSymbol, 5)
        : { bids: [], asks: [] };
      const grid = d.bookParams && (d.bookParams[info.marketId] || d.bookParams[market.id]);
      windows.push(HP.toBinaryWindow(market, onchain, book, grid));
    }
    return windows;
  };
})(typeof window !== "undefined" ? window : globalThis);
