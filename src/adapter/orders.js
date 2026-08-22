(function (g) {
  const HP = (g.HeadlinePulse = g.HeadlinePulse || {});

  HP.placeIntent = async function placeIntent(exchange, intent, opts) {
    const options = opts || {};
    const dryRun = options.dryRun !== false;
    if (Number(intent.onchainStatus) !== HP.ONCHAIN_TRADING) {
      return { ok: false, reason: "not-trading", intent: intent, dryRun: dryRun };
    }
    if (dryRun) return { ok: true, dryRun: true, intent: intent };
    const placed = await exchange.createOrder(
      intent.symbol,
      "limit",
      "buy",
      intent.quantity,
      intent.price,
    );
    return { ok: true, dryRun: false, intent: intent, order: placed };
  };

  HP.cancelIntentOrder = async function cancelIntentOrder(exchange, orderId, symbol, opts) {
    const dryRun = !opts || opts.dryRun !== false;
    if (dryRun) return { ok: true, dryRun: true, id: orderId, symbol: symbol };
    return exchange.cancelOrder(orderId, symbol);
  };
})(typeof window !== "undefined" ? window : globalThis);
