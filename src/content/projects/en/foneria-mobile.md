---
title: foneria-mobile
summary: A production fintech investment app, twice — SwiftUI on iOS, Jetpack Compose on Android. Real money, real users, real code review.
branch: mobile
stack: [Swift, SwiftUI, Kotlin, Jetpack Compose, Hilt, Firebase]
date: 2026-01-15
order: 1
---

People manage fund portfolios, execute trades and track performance in this app — with
their own money. That sentence is the entire requirements document: nothing here is
allowed to be flaky.

## Two platforms, no shortcuts

Native on both sides: **SwiftUI + Combine** on iOS, **Kotlin + Jetpack Compose** on
Android. Architected with MVVM + Clean Architecture; Hilt for DI, Retrofit with
Coroutines/Flow on the network layer, Firebase for analytics, crash reporting and
remote config.

## The unglamorous parts

KYC and video verification flows — the part of fintech nobody posts about, and the
part regulators actually read. Built, shipped, and maintained in production.
