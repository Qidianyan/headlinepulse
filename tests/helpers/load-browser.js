import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..", "..");

export const CORE_SCRIPTS = [
  "src/constants.js",
  "src/math/raw.js",
  "src/math/tick-lot.js",
  "src/math/lifecycle.js",
  "src/policy/news-policy.js",
  "src/mapper/order-intent.js",
  "src/adapter/to-window.js",
  "src/adapter/load-windows.js",
  "src/adapter/orders.js",
  "src/adapter/redeem.js",
];

export const UI_SCRIPTS = [
  "ui/fixtures.js",
  "ui/app.js",
];

function assertNoNodeGlobals(code, file) {
  if (/\brequire\s*\(/.test(code) || /\bmodule\.exports\b/.test(code)) {
    throw new Error("unguarded Node module/require in " + file);
  }
}

export function evalScripts(files) {
  const window = { document: { getElementById: function () { return null; } } };
  const sandbox = { window: window, console: console };
  sandbox.globalThis = window;
  const ctx = vm.createContext(sandbox);
  files.forEach(function (rel) {
    const abs = path.join(root, rel);
    const code = fs.readFileSync(abs, "utf8");
    assertNoNodeGlobals(code, rel);
    vm.runInContext(code, ctx, { filename: abs });
  });
  return window;
}

export function projectRoot() {
  return root;
}
