# HeadlinePulse

**Contest:** [Somnia × DreamDEX Event Contracts](https://dorahacks.io/hackathon/event-contracts)  
**Team:** Qidianyan Tech / yvzhou142857 / GitHub Qidianyan ([headlinepulse](https://github.com/Qidianyan/headlinepulse))  
**Window:** 2026-08-25 → 2026-09-08

## Title

HeadlinePulse — 新闻进门，DreamDEX Event Contract 上出 Up/Down 单

## Tagline

贴一条标题。代理人选 BTC 或 ETH、Up 或 Down，按 tick / lot 在**正在 Trading 的**二进制窗口上挂买单。不走 DreamDEX 现货 HTTP，不编假盘口。

## Description

HeadlinePulse 做两件事，共用一个 mapper：

1. CLI：`npm run agent -- --news "…"` 打出 YES/NO、价格、数量、`marketId`。
2. 手机宽 UI：`npm run ui` → http://127.0.0.1:4173/ui/

SDK 钉死 `@somnia-chain/markets-sdk` **0.28.1**。写盘前看链上状态 **Trading (1)**，临近到期的窗口直接丢掉。Down 价 = 1 − Up，再收成整数 tick。仓位键是 `marketId`，不是会被回收的 pool 地址。

默认 Shannon **dry-run**。真下单需要测试 STT + TestUSDC，并且 `DRY_RUN=0`。

## Demo plan

1. `npm test`（22）
2. `npm run agent -- --news "Bitcoin ETF inflows hit a record as BTC breaks out above resistance"`
3. `npm run ui`，点 Up / Down，收据和 CLI 同一套字段
4. 视频：[HeadlinePulse UI walkthrough](https://github.com/Qidianyan/headlinepulse/releases/download/demo-2026-08-22/headlinepulse.mp4)（2 分 28 秒，本机打开 `npm run ui` 点出来的屏录：吃进 ETF 新闻 → Down → ETH 窗口 → SEC 延迟标题）。
