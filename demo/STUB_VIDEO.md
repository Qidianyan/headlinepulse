# Recording the 2–3 minute video

This environment may not encode H.264. The submission-quality video is a screen recording of:

1. `demo/slides.html` (150s autoplay storyboard), **or**
2. `npm run ui` at phone width + `npm run agent` in a terminal, following `DEMO_SCRIPT.md`.

Suggested capture:

```bash
# Terminal A
npm run ui

# Terminal B
npm run agent -- --news "Bitcoin ETF inflows hit a record as BTC breaks out above resistance"
npm run agent -- --news "Ethereum faces SEC delay as ETH selloff deepens after a bridge hack"
```

Record 375×812 (phone) for the UI and a 16:9 crop of the storyboard for the intro/outro.

Encoded storyboard (150s H.264): [`headlinepulse.mp4`](./headlinepulse.mp4). Replace with a live screen recording of `npm run ui` + `npm run agent` before the DoraHacks submit window if judges want motion, not stills.
