(function (g) {
  const HP = (g.HeadlinePulse = g.HeadlinePulse || {});

  HP.listRedeemable = async function listRedeemable(exchange) {
    return exchange.client.listPastBinaryMarkets({
      status: HP.STATUS_FINALIZED,
      limit: 50,
    });
  };

  HP.redeemWindow = async function redeemWindow(exchange, symbol, amount, opts) {
    const dryRun = !opts || opts.dryRun !== false;
    if (dryRun) {
      return { ok: true, dryRun: true, symbol: symbol, amount: amount };
    }
    return exchange.redeem(symbol, amount);
  };
})(typeof window !== "undefined" ? window : globalThis);
