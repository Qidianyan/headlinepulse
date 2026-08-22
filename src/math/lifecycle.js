(function (g) {
  const HP = (g.HeadlinePulse = g.HeadlinePulse || {});

  HP.isOnchainTrading = function isOnchainTrading(window) {
    return Number(window.onchainStatus) === HP.ONCHAIN_TRADING;
  };

  HP.secondsLeft = function secondsLeft(window, nowSec) {
    return Number(window.expirySec) - Number(nowSec);
  };

  HP.isNearExpiry = function isNearExpiry(window, nowSec, bufferSec) {
    const buffer = bufferSec == null ? HP.NEAR_EXPIRY_SEC : bufferSec;
    return HP.secondsLeft(window, nowSec) <= buffer;
  };

  HP.isTradableWindow = function isTradableWindow(window, nowSec, bufferSec) {
    if (!HP.isOnchainTrading(window)) return false;
    if (HP.isNearExpiry(window, nowSec, bufferSec)) return false;
    return true;
  };

  HP.assetMatches = function assetMatches(window, asset) {
    if (!asset) return true;
    return String(window.asset).toUpperCase() === String(asset).toUpperCase();
  };

  HP.selectTradableWindow = function selectTradableWindow(windows, asset, nowSec, opts) {
    const buffer = opts && opts.nearExpirySec;
    const eligible = (windows || []).filter(function (w) {
      return HP.assetMatches(w, asset) && HP.isTradableWindow(w, nowSec, buffer);
    });
    eligible.sort(function (a, b) {
      return HP.secondsLeft(a, nowSec) - HP.secondsLeft(b, nowSec);
    });
    return eligible[0] || null;
  };

  HP.redeemTargets = function redeemTargets(finalizedList, liveList) {
    const liveIds = {};
    (liveList || []).forEach(function (m) {
      liveIds[m.marketId] = true;
    });
    return (finalizedList || []).filter(function (m) {
      return m.status === HP.STATUS_FINALIZED && !liveIds[m.marketId];
    });
  };
})(typeof window !== "undefined" ? window : globalThis);
