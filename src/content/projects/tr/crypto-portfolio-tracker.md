---
title: crypto-portfolio-tracker
summary: Uçtan uca kişisel kripto portföy uygulaması — telefonda SwiftUI, arkasında kendi Go + Postgres API'm, APNs üzerinden fiyat alarmları.
branch: mobile
stack: [Swift, SwiftUI, Go, PostgreSQL, APNs]
date: 2026-06-02
order: 2
repo: https://github.com/efekckk/crypto-portfolio-tracker
---

Arkasına saklanacak ekibi olmayan bir yan proje: iOS uygulaması, backend ve deploy —
hepsi aynı çift elden.

## İki repo, tek ürün

[SwiftUI uygulaması](https://github.com/efekckk/crypto-portfolio-tracker) varlıkları ve
performansı takip eder; [Go API](https://github.com/efekckk/crypto-portfolio-tracker-api)
(chi + Postgres) fiyatları toplar ve bir coin hareketlendiğinde APNs üzerinden bildirim
yollar. Sözleşmenin iki tarafını da kendin yazmak, API tasarımının neden önemli
olduğunu öğrenmenin en hızlı yolu.
