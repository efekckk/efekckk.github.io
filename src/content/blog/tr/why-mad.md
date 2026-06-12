---
title: Standart sapma yerine neden MAD?
description: Anomali false positive'lerimizi %60 azaltan tek satırlık değişiklik.
branch: data
date: 2026-05-10
---

Standart sapmanın anomali tespiti için bir tasarım hatası var: yakalamaya çalıştığın
anomali, hesabın *içinde*. Tek bir balina işlemi σ'yı şişirir, eşik esner ve sıradaki
üç gerçek anomali görünmeden içeri yürür.

**MAD — Median Absolute Deviation — bu dertten muaf.** Medyanın senin balinanla işi
olmaz.

```python
median = np.median(x)
mad = np.median(np.abs(x - median))
modified_z = 0.6745 * (x - median) / mad
```

`0.6745` sabiti, normal dağılımlarda MAD'i σ ile karşılaştırılabilir yapar; alışıldık
"3.5'te işaretle" kuralı aynen okunmaya devam eder.

Üretimdeki izleme sistemimizde bu değişiklik — artı haftanın gününe göre baseline'lar —
false positive'leri %60 azalttı. Nöbet telefonu sessizleşti. Eski matematiği özleyen
olmadı.

**Güncelleme:** bu matematik artık bir paket. `pip install madwatch` — kaynak kodu
[GitHub'da](https://github.com/efekckk/madwatch). Tasarımı gereği balina geçirmez.
