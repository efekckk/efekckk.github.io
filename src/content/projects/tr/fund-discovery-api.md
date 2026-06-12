---
title: fund-discovery-api
summary: AI chatbot'u besleyen, 15+ filtre kriterli RESTful fon keşif API'si. Otonom fon analizi için multi-agent mimari yolda.
branch: ai
stack: [NestJS, TypeScript, PostgreSQL, Docker, Swagger]
date: 2026-02-01
order: 1
---

Bir AI chatbot ancak çağırabildiği API kadar akıllıdır. Bu API ona gerçekten
sorgulayabileceği bir fon evreni verir: risk seviyesi, kategori, getiri, ücretler —
**15+ filtre kriteri**, session tabanlı auth ve akıllı cache'lemeyle temiz bir RESTful
arayüz arkasında.

## Nereye gidiyor

Sıradaki katman bir **multi-agent mimari**: bir agent fonları tarar, bir diğeri
portföy adayları kurar, üçüncüsü piyasa istihbaratı yazar. API bir endpoint olmaktan
çıkıp agent'ların ortak atölyesine dönüşür.

## Neden önemli

Fon seçimi eskiden tablo kaydıran bir insandı. Şimdi bir sohbet — ve sohbetin
arkasında gerçek veri var.
