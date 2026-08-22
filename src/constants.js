(function (g) {
  const HP = (g.HeadlinePulse = g.HeadlinePulse || {});

  HP.CHAIN_ID = 50312;
  HP.INDEXER_URL = "https://dev.smk.somnia.host/v1/graphql";
  HP.RPC_URL = "https://api.infra.testnet.somnia.network";
  HP.WS_URL = "wss://api.infra.testnet.somnia.network/ws";
  HP.EXPLORER = "https://shannon-explorer.somnia.network";

  HP.BINARY_MODULE = "0x3ecC694Cef705358864a646142ac17A90E29e388";
  HP.MARKETS_CORE = "0x2802504314685D89bF6C992CA5a8e7cC78bc0294";
  HP.BINARY_SETTLEMENT = "0xbF4a49e0Dfd092e5FBE8E5761064C49533e6Ed23";
  HP.TEST_COLLATERAL = "0x70a86D8842FB63C4Ad2b7cdddF530eBf1BB25d8E";

  HP.ONCHAIN_LISTED = 0;
  HP.ONCHAIN_TRADING = 1;
  HP.ONCHAIN_LOCKED = 2;
  HP.ONCHAIN_SETTLING = 3;
  HP.ONCHAIN_RESOLVED = 4;
  HP.ONCHAIN_VOIDED = 5;

  HP.STATUS_FINALIZED = "Finalized";
  HP.NEAR_EXPIRY_SEC = 30;
  HP.DEFAULT_STAKE = 10;
  HP.DEFAULT_TICK_RAW = "1000";
  HP.DEFAULT_LOT_RAW = "1000000";
  HP.DEFAULT_DECIMALS = 6;

  HP.BULLISH_TERMS = [
    "rally",
    "surge", "soar", "pump", "breakout", "all-time high", "ath",
    "record high", "etf inflow", "inflows hit", "approval", "bullish",
    "beats", "adopt", "buy the dip", "green", "higher", "reclaim",
  ];
  HP.BEARISH_TERMS = [
    "crash", "plunge", "dump", "hack", "ban", "selloff", "sell-off",
    "outflow", "lawsuit", "liquidation", "collapse", "bearish",
    "delay", "reject", "sec charges", "lower", "red", "capitulation",
  ];
})(typeof window !== "undefined" ? window : globalThis);
