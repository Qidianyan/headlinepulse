import { chromium } from "playwright-core";

const url = process.env.UI_URL || "http://127.0.0.1:4173/ui/";
const out = process.env.UI_SHOT || "ui.png";
const errors = [];
const browser = await chromium.launch({ channel: "chrome", headless: true });
const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
page.on("pageerror", function (err) { errors.push(String(err)); });
page.on("console", function (msg) {
  if (msg.type() === "error") errors.push(msg.text());
});
await page.goto(url, { waitUntil: "domcontentloaded", timeout: 15000 });
const surface = page.locator("#surface");
await surface.waitFor({ state: "visible" });
const box = await surface.boundingBox();
const before = await page.locator("#intent").innerText();
await page.locator("#btn-down").click();
const after = await page.locator("#intent").innerText();
const downOn = await page.locator("#btn-down").evaluate(function (el) {
  return el.classList.contains("active");
});
await page.screenshot({ path: out, fullPage: true });
await browser.close();
const pageErrors = errors.filter(function (e) {
  return !/favicon/i.test(e);
});
const filled = box && box.width >= 360 && box.height >= 700;
if (pageErrors.length || !filled || !after.includes("Down")) {
  console.error(JSON.stringify({ ok: false, errors: pageErrors, box: box, before: before, after: after, downOn: downOn }, null, 2));
  process.exit(1);
}
console.log(JSON.stringify({ ok: true, errors: errors, box: box, before: before, after: after, downOn: downOn }, null, 2));
