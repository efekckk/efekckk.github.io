---
title: crypto-portfolio-tracker
summary: A personal crypto portfolio app built end to end — SwiftUI on the phone, my own Go + Postgres API behind it, price alerts over APNs.
branch: mobile
stack: [Swift, SwiftUI, Go, PostgreSQL, APNs]
date: 2026-06-02
order: 2
repo: https://github.com/efekckk/crypto-portfolio-tracker
---

A side project with no team to hide behind: the iOS app, the backend and the
deployment are all one pair of hands.

## Two repos, one product

The [SwiftUI app](https://github.com/efekckk/crypto-portfolio-tracker) tracks holdings
and performance; the
[Go API](https://github.com/efekckk/crypto-portfolio-tracker-api) (chi + Postgres)
aggregates prices and pushes alerts through APNs when a coin moves. Building both
sides of the contract yourself is the fastest way to learn why API design matters.
