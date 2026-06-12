---
title: anomaly-detection-engine
summary: Finansal akışlar için 3 katmanlı gerçek zamanlı izleme. MAD üzerine Modified Z-Score ve day-parting baseline'lar — %60 daha az false positive.
branch: data
stack: [React, NestJS, PostgreSQL, OpenRouter]
date: 2025-09-01
order: 1
---

Finansal metrikler bilerek gürültülüdür: pazartesi cumaya benzemez, sabah 9 gece
yarısına benzemez ve klasik z-score her maaş gününde panik atak geçirir. Bu motor,
gerçek zamanlı finansal akışları kurt geliyor diye bağırmadan izler.

## Nasıl çalışıyor

Üç katman: veri alımı, istatistik, içgörü. İstatistik katmanı standart sapma yerine
**MAD (Median Absolute Deviation) üzerine kurulu Modified Z-Score** kullanır — tek bir
balina işlemi baseline'ı sürükleyemez. Haftanın gününe göre normalize edilmiş
baseline'lar ve aynı-saat karşılaştırması haftalık mevsimselliği çözer. Sonuç:
yerini aldığı naif yaklaşıma göre **%60 daha az false positive**.

## İçgörü katmanı

Bir alarm gerçekten öttüğünde, GPT-4 (OpenRouter üzerinden) alarmı ve metrikler arası
bağlamı alır — net akış vs. çıkış, funnel dönüşüm oranları — ve insan diliyle bir kök
neden analizi yazar. Nöbetçi insan sayı duvarı değil, bir paragraf okur.

## Açık kaynak

Bu motorun istatistiksel çekirdeği artık PyPI'da:
[madwatch](https://github.com/efekckk/madwatch) — `pip install madwatch` ile aynı MAD
tabanlı Modified Z-Score, akış tespiti ve haftanın gününe göre baseline'lar elinde.
