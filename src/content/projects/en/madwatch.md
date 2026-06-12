---
title: madwatch
summary: The anomaly math from production, packaged — pip install madwatch. MAD-based Modified Z-Score, seasonal baselines, a streaming detector and a CLI.
branch: data
stack: [Python, NumPy, pytest, GitHub Actions, PyPI]
date: 2026-06-12
order: 3
repo: https://github.com/efekckk/madwatch
pkg: https://pypi.org/project/madwatch/
---

The statistical core of the anomaly detection engine, extracted into an open-source
Python package. Median-based, so one whale transaction can't inflate the baseline and
mask the next real anomaly.

## What's inside

`mad()` and `modified_zscore()` as a pure-NumPy core, a `RollingDetector` for streaming
data, and a `SeasonalBaseline` that buckets history by day-of-week and hour — the same
combination that cut false positives by 60% in production. A CLI ships with it:
`madwatch data.csv --column amount --plot out.png`.

## How it was built

Test-driven from the first line: 39 tests including the whale test, CI on four Python
versions, releases flow to PyPI through trusted publishing — no tokens, just a git tag.
