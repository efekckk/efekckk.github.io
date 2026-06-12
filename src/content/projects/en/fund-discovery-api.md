---
title: fund-discovery-api
summary: RESTful fund discovery with 15+ filter criteria, feeding an AI chatbot. Multi-agent architecture for autonomous fund analysis on the way.
branch: ai
stack: [NestJS, TypeScript, PostgreSQL, Docker, Swagger]
date: 2026-02-01
order: 1
---

An AI chatbot is only as smart as the API it can call. This one gives it a fund
universe it can actually query: **15+ filter criteria** — risk level, category,
returns, fees — behind a clean RESTful interface with session-based auth and
intelligent caching.

## Where it's going

The next layer is a **multi-agent architecture**: one agent screens funds, another
builds portfolio candidates, a third writes market intelligence. The API stops being
an endpoint and becomes the workshop the agents share.

## Why it matters

Fund selection used to be a human scrolling a table. Now it's a conversation — and
the conversation has real data behind it.
