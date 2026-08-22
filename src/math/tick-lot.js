(function (g) {
  const HP = (g.HeadlinePulse = g.HeadlinePulse || {});

  function oneUnit(decimals) {
    return 10n ** BigInt(decimals);
  }

  HP.snapToTickRaw = function snapToTickRaw(raw, tickRaw, one) {
    const tick = BigInt(tickRaw);
    if (tick <= 0n) throw new Error("tick must be positive");
    let aligned = raw - (raw % tick);
    if (aligned < tick) aligned = tick;
    const highest = ((one - tick) / tick) * tick;
    if (aligned > highest) aligned = highest;
    return aligned;
  };

  HP.snapPriceToTick = function snapPriceToTick(price, tickRaw, decimals) {
    const one = oneUnit(decimals);
    const raw = HP.toRawInteger(price, decimals);
    return HP.fromRawInteger(HP.snapToTickRaw(raw, tickRaw, one), decimals);
  };

  HP.snapQtyToLot = function snapQtyToLot(qty, lotRaw, decimals) {
    const lot = BigInt(lotRaw);
    if (lot <= 0n) throw new Error("lot must be positive");
    const raw = HP.toRawInteger(qty, decimals);
    const aligned = raw - (raw % lot);
    if (aligned < lot) return 0;
    return HP.fromRawInteger(aligned, decimals);
  };

  HP.downPriceFromUp = function downPriceFromUp(upPrice, decimals) {
    const one = oneUnit(decimals);
    const upRaw = HP.toRawInteger(upPrice, decimals);
    return HP.fromRawInteger(one - upRaw, decimals);
  };

  HP.isOnTick = function isOnTick(price, tickRaw, decimals) {
    const raw = HP.toRawInteger(price, decimals);
    return raw % BigInt(tickRaw) === 0n;
  };

  HP.isOnLot = function isOnLot(qty, lotRaw, decimals) {
    const raw = HP.toRawInteger(qty, decimals);
    return raw > 0n && raw % BigInt(lotRaw) === 0n;
  };

  HP.priceInOpenUnit = function priceInOpenUnit(price) {
    return price > 0 && price < 1;
  };
})(typeof window !== "undefined" ? window : globalThis);
