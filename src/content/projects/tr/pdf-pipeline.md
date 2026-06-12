---
title: pdf-pipeline
summary: 489 fon izahnamesi PDF'inden OCR fallback ve LLM destekli hata düzeltmeyle portföy verisi çıkarımı. Aylık Excel ritüelini emekli etti.
branch: data
stack: [Python, pdfplumber, Pandas, PostgreSQL]
date: 2025-11-01
order: 2
---

Fon izahname PDF'leri, verinin saklanmak için gittiği yerdir. **489 tane**, her biri
tablolar hakkında güçlü ve birbiriyle çelişen fikirleri olan biri tarafından
biçimlendirilmiş.

## Pipeline

İlk geçişi pdfplumber yapar; taranmış olanları OCR fallback yakalar; aradan sızan
çıkarım hatalarını LLM tabanlı düzeltme adımı temizler. Çıktı, PostgreSQL'e temiz ve
doğrulanmış portföy verisi olarak iner.

## Kazanç

Aylık gelir paylaşımı mutabakatı ve algoritmik fon seçimi artık kod olarak çalışıyor.
Önceki implementasyon bir insan, bir Excel dosyası ve kayıp bir öğleden sonraydı —
her ay, düzenli olarak.
