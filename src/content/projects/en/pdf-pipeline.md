---
title: pdf-pipeline
summary: Extracted portfolio data from 489 fund disclosure PDFs with OCR fallback and LLM-based error correction. Replaced a monthly Excel ritual.
branch: data
stack: [Python, pdfplumber, Pandas, PostgreSQL]
date: 2025-11-01
order: 2
---

Fund disclosure PDFs are where data goes to hide. **489 of them**, each formatted by
someone with strong and conflicting opinions about tables.

## The pipeline

pdfplumber does the first pass; an OCR fallback catches the scanned ones; an LLM-based
correction step fixes the extraction errors that slip through. The output lands in
PostgreSQL as clean, validated portfolio data.

## The payoff

Monthly revenue-sharing reconciliation and algorithmic fund selection now run as code.
The previous implementation was a human, an Excel file, and a lost afternoon — every
single month.
