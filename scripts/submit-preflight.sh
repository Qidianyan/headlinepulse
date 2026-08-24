#!/usr/bin/env bash
# Event Contracts BUIDL 提交助手 — 2026-08-25 08:00 后运行
set -euo pipefail
ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$ROOT"

echo "== HeadlinePulse preflight =="
npm test
echo
echo "== Fields (paste into DoraHacks) =="
echo "Project: HeadlinePulse"
echo "Tagline: 新闻进门，DreamDEX Event Contract 上出 Up/Down 单"
echo "GitHub:  https://github.com/Qidianyan/headlinepulse"
echo "Video:   https://github.com/Qidianyan/headlinepulse/releases/download/demo-2026-08-22/headlinepulse.mp4"
echo
echo "Open: https://dorahacks.io/hackathon/event-contracts/detail"
echo "Click Submit BUIDL after submission window opens (2026-08-25 08:00)."
