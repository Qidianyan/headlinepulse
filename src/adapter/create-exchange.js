import {
  SomniaMarkets,
  isBinaryMarket,
  SOMNIA_TESTNET_ADDRESSES,
} from "@somnia-chain/markets-sdk";
import { somniaShannon } from "@somnia-chain/markets-sdk/chains";
import { HeadlinePulse as HP } from "../core.js";

export { isBinaryMarket };

export function createExchange(opts) {
  const options = opts || {};
  const config = {
    indexerUrl: options.indexerUrl || process.env.SOMNIA_INDEXER_URL || HP.INDEXER_URL,
    chain: somniaShannon,
    wsRpcUrl: options.wsRpcUrl || process.env.SOMNIA_WS_URL || HP.WS_URL,
    addresses: SOMNIA_TESTNET_ADDRESSES,
  };
  if (options.privateKey || process.env.PRIVATE_KEY) {
    config.privateKey = options.privateKey || process.env.PRIVATE_KEY;
  }
  if (options.signal) config.signal = options.signal;
  return new SomniaMarkets(config);
}

export async function discoverLiveWindows(exchange) {
  return HP.loadWindows(exchange, { isBinaryMarket: isBinaryMarket });
}
