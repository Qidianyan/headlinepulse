# HeadlinePulse — 2–3 分钟走查

Team: Qidianyan Tech / yvzhou142857 / GitHub Qidianyan  
时长：**约 2 分 30 秒**

左边 CLI，右边 `npm run ui`（手机宽）。默认 Shannon **dry-run**。

---

## 0:00–0:20 — 问题

ETF、黑客、SEC 延迟这种标题，人已经有方向了。还在换单位、找窗口的时候，15 分钟盘已经过了。

DreamDEX 上 BTC / ETH 的 Up-or-Down 已经在挂。缺的是一张桌子：只说 `marketId`、tick、lot，而且链上状态必须是 **Trading (1)**。

## 0:20–0:45 — 做法

- 发现窗口走 `@somnia-chain/markets-sdk` **0.28.1**，不走现货 HTTP。
- 写盘前看链上 **Trading (1)**。快到期的丢掉。
- Up 是 (0,1) 概率。**Down = 1 − Up**，收成整数 tick。
- 仓位键是 **marketId / symbol**。pool 地址会被回收，不能当键。
- 结算后从 **Finalized** 列表兑。`loadMarkets` 已经把它们从交易盘拿掉。

## 0:45–1:05 — 两面同一 mapper

1. CLI：贴标题，出 YES/NO、价、量、`marketId`。
2. 手机 UI：窗口、倒计时、大按钮 Up/Down、回执。

有测试 STT + TestUSDC 再把 `DRY_RUN` 关掉。

## 1:05–2:15 — 现场

**1:05** 打开 UI。BTC 15m、ETH 1h 有价。

**1:15** 标题：*“Bitcoin ETF inflows hit a record as BTC breaks out above resistance.”* 点 **吃进这条新闻**。横幅 **BTC Up**。字段：YES、tick 价、lot 量、marketId。锁定和快到期的窗口不会被选中。

**1:35** 点 **Down**。回执翻到 NO，价是 `1 − Up`。注码按 lot 格子走。

**1:50** 终端：

```bash
node src/cli.js --news "Bitcoin ETF inflows hit a record as BTC breaks out above resistance"
```

同一边、同一 marketId、同一价量。跑两次，主字段不漂。

**2:00** 第二条：*“Ethereum faces SEC delay as ETH selloff deepens after a bridge hack.”* 代理人在 ETH 1h 上买 **Down**，不会去锁盘只剩 15 秒的那一档。

**2:10** 兑付看 **Finalized**。交易盘上扫到的是 0。

## 2:15–2:30 — 下一步

接新闻流、可选理由、有钥匙再把同一 intent 打到 Shannon。DreamDEX 多挂标的就跟。

收：新闻是信号，Event Contract 是盘口，HeadlinePulse 把两者接上。
