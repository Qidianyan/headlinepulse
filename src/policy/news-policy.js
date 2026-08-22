(function (g) {
  const HP = (g.HeadlinePulse = g.HeadlinePulse || {});

  function countHits(text, terms) {
    const hits = [];
    terms.forEach(function (term) {
      if (text.indexOf(term) !== -1) hits.push(term);
    });
    return hits;
  }

  HP.detectAsset = function detectAsset(text) {
    const t = String(text).toLowerCase();
    if (/\bbitcoin\b|\bbtc\b/.test(t)) return "BTC";
    if (/\bethereum\b|\beth\b|\bether\b/.test(t)) return "ETH";
    return "BTC";
  };

  HP.interpretNews = function interpretNews(news) {
    const text = String(news || "").toLowerCase();
    const bull = countHits(text, HP.BULLISH_TERMS);
    const bear = countHits(text, HP.BEARISH_TERMS);
    const score = bull.length - bear.length;
    const side = score < 0 ? "Down" : "Up";
    const magnitude = Math.abs(score);
    const confidence = Math.min(1, 0.55 + magnitude * 0.12);
    const hits = score < 0 ? bear : bull;
    const asset = HP.detectAsset(text);
    return {
      asset: asset,
      side: side,
      score: score,
      confidence: confidence,
      hits: hits,
      rationale:
        asset +
        " " +
        side +
        " from headline (" +
        (hits.join(", ") || "neutral bias") +
        ")",
    };
  };

  HP.sizeFromConfidence = function sizeFromConfidence(stake, confidence, lotRaw, decimals) {
    const lots = Math.max(1, Math.round(Number(stake) * Number(confidence)));
    return HP.snapQtyToLot(lots, lotRaw, decimals);
  };
})(typeof window !== "undefined" ? window : globalThis);
