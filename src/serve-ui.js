#!/usr/bin/env node
import fs from "node:fs";
import http from "node:http";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const port = Number(process.env.PORT || 4173);
const types = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".md": "text/markdown; charset=utf-8",
};

function safeJoin(urlPath) {
  const rel = decodeURIComponent(urlPath.split("?")[0]);
  const resolved = path.resolve(root, "." + rel);
  if (!resolved.startsWith(root)) return null;
  return resolved;
}

const server = http.createServer(function (req, res) {
  let urlPath = req.url.split("?")[0];
  if (urlPath === "/" || urlPath === "/ui" || urlPath === "/ui/") {
    urlPath = "/ui/index.html";
  }
  if (urlPath === "/favicon.ico") urlPath = "/ui/favicon.svg";
  let file = safeJoin(urlPath);
  if (file && fs.existsSync(file) && fs.statSync(file).isDirectory()) {
    file = path.join(file, "index.html");
  }
  if (!file || !fs.existsSync(file) || fs.statSync(file).isDirectory()) {
    res.writeHead(404, { "content-type": "text/plain" });
    res.end("not found");
    return;
  }
  const ext = path.extname(file);
  res.writeHead(200, { "content-type": types[ext] || "application/octet-stream" });
  fs.createReadStream(file).pipe(res);
});

server.listen(port, "127.0.0.1", function () {
  console.log("HeadlinePulse UI  http://127.0.0.1:" + port + "/ui/");
});
