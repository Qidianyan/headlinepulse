import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import { CORE_SCRIPTS, UI_SCRIPTS, evalScripts, projectRoot } from "./helpers/load-browser.js";

test("browser scripts install HeadlinePulse with window and no Node module", function () {
  const window = evalScripts(CORE_SCRIPTS.concat(UI_SCRIPTS));
  assert.ok(window.HeadlinePulse);
  assert.ok(window.HeadlinePulseUI);
  assert.equal(typeof window.HeadlinePulse.mapNewsToIntent, "function");
  assert.equal(typeof window.HeadlinePulseUI.readTape, "function");
  const news = "Bitcoin ETF inflows hit a record as BTC breaks out above resistance";
  const intent = window.HeadlinePulseUI.readTape(news);
  assert.equal(intent.ok, true);
  assert.equal(intent.side, "Up");
  assert.ok(intent.marketId);
  assert.ok(intent.price > 0 && intent.price < 1);
});

test("the HTML page exists and loads the core scripts as plain files", function () {
  const html = fs.readFileSync(path.join(projectRoot(), "ui", "index.html"), "utf8");
  assert.match(html, /id="surface"/);
  assert.match(html, /id="btn-up"/);
  assert.match(html, /id="btn-down"/);
  assert.equal(html.includes("type=\"module\""), false);
  CORE_SCRIPTS.forEach(function (rel) {
    assert.ok(html.includes(rel.replace("src/", "../src/")), rel);
  });
});
