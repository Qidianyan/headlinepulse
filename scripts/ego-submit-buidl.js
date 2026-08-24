// Event Contracts BUIDL — ego-browser 填表脚本
// 运行：ego-browser nodejs < scripts/ego-submit-buidl.js
// 前提：2026-08-25 08:00 后；DoraHacks 已登录

const FIELDS = {
  name: 'HeadlinePulse',
  tagline: '新闻进门，DreamDEX Event Contract 上出 Up/Down 单',
  github: 'https://github.com/Qidianyan/headlinepulse',
  video: 'https://github.com/Qidianyan/headlinepulse/releases/download/demo-2026-08-22/headlinepulse.mp4',
  description:
    'HeadlinePulse maps news headlines to DreamDEX Event Contract Up/Down buy intents. CLI (npm run agent) and mobile UI (npm run ui) share one mapper on @somnia-chain/markets-sdk 0.28.1. Default Shannon dry-run.',
}

const task = await useOrCreateTaskSpace('dorahacks event buidl')
await openOrReuseTab('https://dorahacks.io/hackathon/event-contracts/detail', { wait: true, timeout: 60 })
await wait(3)

// click Submit BUIDL — ref may change; grep snapshot for "Submit BUIDL"
const snap = await snapshotText()
const m = snap.match(/text "Submit BUIDL"[\s\S]*?ref=(\d+)/)
if (!m) {
  cliLog('Submit BUIDL button not found — window may not be open yet')
  cliLog(snap.slice(0, 2000))
  process.exit(1)
}
await click('@' + m[1], { label: 'Submit BUIDL' })
await wait(5)
cliLog(await pageInfo())
cliLog((await snapshotText()).slice(0, 8000))
cliLog('--- paste manually if form refs differ ---')
cliLog(FIELDS)
