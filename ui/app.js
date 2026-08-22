(function (g) {
  const HP = g.HeadlinePulse;
  const UI = (g.HeadlinePulseUI = g.HeadlinePulseUI || {});

  UI.state = {
    news: UI.demoNews || "",
    side: "Up",
    stake: 10,
    selectedId: null,
    intent: null,
  };

  UI.pct = function pct(p) {
    return Math.round(Number(p) * 100) + "¢";
  };

  UI.clock = function clock(windowRow, nowSec) {
    const left = Math.max(0, Number(windowRow.expirySec) - Number(nowSec));
    const m = Math.floor(left / 60);
    const s = left % 60;
    return m + ":" + String(s).padStart(2, "0");
  };

  UI.readTape = function readTape(news, windows, nowSec, stake) {
    const rows = windows || UI.windows;
    const intent = HP.mapNewsToIntent(news, rows, nowSec || UI.nowSec, {
      stake: stake || UI.state.stake,
    });
    if (intent.ok) {
      UI.state.intent = intent;
      UI.state.side = intent.side;
      UI.state.selectedId = intent.marketId;
    }
    return intent;
  };

  UI.setSide = function setSide(side) {
    UI.state.side = side === "Down" ? "Down" : "Up";
    const rows = UI.windows || [];
    const picked = rows.find(function (w) {
      return w.marketId === UI.state.selectedId;
    }) || rows[0];
    if (!picked) return UI.state.intent;
    const policy = {
      asset: picked.asset,
      side: UI.state.side,
      confidence: 1,
      hits: ["manual"],
      rationale: "Manual " + UI.state.side + " on " + picked.asset,
    };
    UI.state.intent = HP.buildOrderIntent(policy, picked, UI.state.stake);
    return UI.state.intent;
  };

  function el(id) {
    return g.document && g.document.getElementById ? g.document.getElementById(id) : null;
  }

  function paintWindows() {
    const host = el("markets");
    if (!host) return;
    host.innerHTML = (UI.windows || []).map(function (w) {
      const on = w.marketId === UI.state.selectedId ? " on" : "";
      const mid = (Number(w.upBid) + Number(w.upAsk)) / 2;
      return (
        '<button class="chip' + on + '" data-id="' + w.marketId + '" type="button">' +
        '<span class="chip-k">' + w.asset + " · " + w.cadence + "</span>" +
        '<span class="chip-p">' + UI.pct(mid) + " Up</span>" +
        '<span class="chip-t">' + UI.clock(w, UI.nowSec) + " left</span>" +
        "</button>"
      );
    }).join("");
  }

  function paintIntent() {
    const box = el("intent");
    const intent = UI.state.intent;
    if (!box) return;
    if (!intent || !intent.ok) {
      box.textContent = (intent && intent.reason) || "贴一条标题，或点 Up / Down。";
      return;
    }
    box.innerHTML =
      "<strong>" + intent.side + "</strong> · " + intent.symbol +
      "<br>price " + intent.price + " · qty " + intent.quantity +
      "<br>Up " + intent.upPrice + " · Down " + intent.downPrice +
      "<br>marketId " + intent.marketId.slice(0, 10) + "…" + intent.marketId.slice(-4) +
      "<br>" + intent.rationale + " · dry-run";
  }

  function paintSideButtons() {
    const up = el("btn-up");
    const down = el("btn-down");
    if (up) up.classList.toggle("active", UI.state.side === "Up");
    if (down) down.classList.toggle("active", UI.state.side === "Down");
  }

  UI.paint = function paint() {
    const surface = el("surface");
    if (surface) surface.setAttribute("data-filled", "1");
    const news = el("news");
    if (news && !news.value) news.value = UI.state.news;
    const stake = el("stake");
    if (stake) stake.textContent = String(UI.state.stake);
    const banner = el("agent-banner");
    if (banner && UI.state.intent && UI.state.intent.ok) {
      banner.textContent =
        "Agent · " + UI.state.intent.asset + " " + UI.state.intent.side +
        " · conf " + Math.round(UI.state.intent.confidence * 100) + "%";
    }
    paintWindows();
    paintSideButtons();
    paintIntent();
  };

  function bind(id, fn) {
    const node = el(id);
    if (node) node.onclick = fn;
  }

  UI.bindControls = function bindControls() {
    const news = el("news");
    bind("btn-read", function () {
      UI.state.news = news ? news.value : UI.state.news;
      UI.readTape(UI.state.news, UI.windows, UI.nowSec, UI.state.stake);
      UI.paint();
    });
    bind("btn-up", function () { UI.setSide("Up"); UI.paint(); });
    bind("btn-down", function () { UI.setSide("Down"); UI.paint(); });
    bind("stake-up", function () { UI.state.stake += 1; UI.setSide(UI.state.side); UI.paint(); });
    bind("stake-down", function () {
      UI.state.stake = Math.max(1, UI.state.stake - 1);
      UI.setSide(UI.state.side);
      UI.paint();
    });
    bind("markets", function (ev) {
      const btn = ev.target.closest("[data-id]");
      if (!btn) return;
      UI.state.selectedId = btn.getAttribute("data-id");
      UI.setSide(UI.state.side);
      UI.paint();
    });
  };

  UI.boot = function boot() {
    if (!el("surface")) return;
    UI.readTape(UI.state.news, UI.windows, UI.nowSec, UI.state.stake);
    UI.bindControls();
    UI.paint();
  };

  if (g.document && g.document.addEventListener) {
    g.document.addEventListener("DOMContentLoaded", UI.boot);
  }
})(typeof window !== "undefined" ? window : globalThis);
