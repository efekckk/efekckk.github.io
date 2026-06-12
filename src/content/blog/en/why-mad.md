---
title: Why MAD instead of standard deviation?
description: The one-line change that cut our anomaly false positives by 60%.
branch: data
date: 2026-05-10
---

Standard deviation has a design flaw for anomaly detection: the anomaly you're trying
to catch is *inside* the calculation. One whale transaction inflates σ, the threshold
stretches, and the next three real anomalies walk through undetected.

**MAD — Median Absolute Deviation — doesn't have that problem.** Medians don't care
about your whale.

```python
median = np.median(x)
mad = np.median(np.abs(x - median))
modified_z = 0.6745 * (x - median) / mad
```

The `0.6745` constant makes MAD comparable to σ for normal distributions, so the usual
"flag at 3.5" rule still reads naturally.

In our production monitoring this swap — plus day-of-week baselines — cut false
positives by 60%. The on-call phone got quieter. Nobody missed the old math.
