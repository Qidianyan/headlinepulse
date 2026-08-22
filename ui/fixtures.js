(function (g) {
  const UI = (g.HeadlinePulseUI = g.HeadlinePulseUI || {});
  UI.nowSec = 1787400000;
  UI.demoNews = "Bitcoin ETF inflows hit a record as BTC breaks out above resistance";
  UI.windows = [
    {
      marketId: "0x00000000000000000000000000000000000000000000000000000000000000b1",
      symbol: "BTC-22AUG26-1600/TUSDC",
      upSymbol: "BTC-22AUG26-1600/TUSDC#YES",
      downSymbol: "BTC-22AUG26-1600/TUSDC#NO",
      asset: "BTC",
      cadence: "15m",
      question: "BTC 15m Up or Down vs the window open?",
      expirySec: 1787400900,
      tradingStartSec: 1787400000,
      onchainStatus: 1,
      indexerStatus: "Trading",
      upBid: 0.54,
      upAsk: 0.56,
      tickRaw: "1000",
      lotRaw: "1000000",
      minQtyRaw: "1000000",
      quoteDecimals: 6,
    },
    {
      marketId: "0x00000000000000000000000000000000000000000000000000000000000000e2",
      symbol: "ETH-22AUG26-1700/TUSDC",
      upSymbol: "ETH-22AUG26-1700/TUSDC#YES",
      downSymbol: "ETH-22AUG26-1700/TUSDC#NO",
      asset: "ETH",
      cadence: "1h",
      question: "ETH 1h Up or Down vs the window open?",
      expirySec: 1787403600,
      tradingStartSec: 1787400000,
      onchainStatus: 1,
      indexerStatus: "Trading",
      upBid: 0.48,
      upAsk: 0.5,
      tickRaw: "1000",
      lotRaw: "1000000",
      minQtyRaw: "1000000",
      quoteDecimals: 6,
    },
  ];
})(typeof window !== "undefined" ? window : globalThis);
