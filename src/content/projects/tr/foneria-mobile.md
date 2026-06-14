---
title: Foneria
summary: Üretimde bir fintech yatırım uygulaması, iki kere — iOS'ta SwiftUI, Android'de Jetpack Compose. Gerçek para, gerçek kullanıcı, gerçek code review.
branch: mobile
stack: [Swift, SwiftUI, Kotlin, Jetpack Compose, Hilt, Firebase]
date: 2026-01-15
order: 1
---

İnsanlar bu uygulamada fon portföylerini yönetiyor, alım satım yapıyor ve performans
takip ediyor — kendi paralarıyla. Bu cümle gereksinim dokümanının tamamı: burada hiçbir
şeyin aksama lüksü yok.

## İki platform, kestirme yok

İki tarafta da native: iOS'ta **SwiftUI + Combine**, Android'de **Kotlin + Jetpack
Compose**. MVVM + Clean Architecture; DI için Hilt, ağ katmanında Retrofit +
Coroutines/Flow, analitik, crash raporu ve remote config için Firebase.

## Gösterişsiz kısımlar

KYC ve görüntülü doğrulama akışları — fintech'in kimsenin paylaşmadığı ama
regülatörlerin asıl okuduğu kısmı. Yazıldı, yayınlandı, üretimde bakımı yapılıyor.
