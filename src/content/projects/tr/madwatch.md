---
title: madwatch
summary: Üretimdeki anomali matematiği, paket halinde — pip install madwatch. MAD tabanlı Modified Z-Score, sezonluk baseline'lar, streaming dedektör ve CLI.
branch: data
stack: [Python, NumPy, pytest, GitHub Actions, PyPI]
date: 2026-06-12
order: 3
repo: https://github.com/efekckk/madwatch
pkg: https://pypi.org/project/madwatch/
image: /projects/madwatch.png
---

Anomali tespit motorunun istatistiksel çekirdeği, açık kaynak bir Python paketine
çıkarıldı. Medyan tabanlı olduğu için tek bir balina işlemi baseline'ı şişirip sıradaki
gerçek anomaliyi maskeleyemez.

## İçinde ne var

Saf NumPy çekirdeği olarak `mad()` ve `modified_zscore()`, akan veri için
`RollingDetector` ve geçmişi haftanın günü × saat dilimlerine ayıran `SeasonalBaseline`
— üretimde false positive'leri %60 azaltan kombinasyonun aynısı. Yanında CLI'ı da
geliyor: `madwatch data.csv --column amount --plot out.png`.

## Nasıl yapıldı

İlk satırdan itibaren test güdümlü: balina testi dahil 39 test, dört Python sürümünde
CI, PyPI'a trusted publishing ile sürüm — token yok, sadece git tag.
