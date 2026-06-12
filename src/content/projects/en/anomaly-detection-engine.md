---
title: anomaly-detection-engine
summary: Three-layer real-time monitoring for financial streams. Modified Z-Score over MAD with day-parting baselines — 60% fewer false positives.
branch: data
stack: [React, NestJS, PostgreSQL, OpenRouter]
date: 2025-09-01
order: 1
---

Financial metrics are noisy on purpose: Mondays don't look like Fridays, 9 AM doesn't
look like midnight, and a classic z-score panics at every payday. This engine watches
real-time financial streams without crying wolf.

## How it works

Three layers: ingest, statistics, insight. The statistics layer uses a **Modified
Z-Score built on MAD** (Median Absolute Deviation) instead of standard deviation, so a
single whale transaction can't drag the baseline. Day-of-week normalized baselines and
same-hour comparison handle weekly seasonality. Result: **60% fewer false positives**
than the naive approach it replaced.

## The insight layer

When something *does* fire, GPT-4 (via OpenRouter) gets the alert plus cross-metric
context — net flow vs. cash out, funnel conversion ratios — and writes a human-readable
root cause analysis. The on-call human reads a paragraph, not a wall of numbers.
