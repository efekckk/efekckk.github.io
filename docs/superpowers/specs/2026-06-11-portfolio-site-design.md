# Portfolyo Sitesi — Tasarım Dokümanı

**Tarih:** 2026-06-11
**Durum:** Onaylandı (kullanıcı onayı: brainstorming oturumu)

## Amaç

Efecan Küçük için genel amaçlı kişisel portfolyo sitesi: iş başvuruları, kişisel marka ve
potansiyel freelance fırsatlarının tamamına hizmet eder. Tek bir hedef kitleye optimize
edilmemiştir; projeler, deneyim, blog ve iletişim bir arada sunulur.

## Kimlik ve Konsept: "Paralel Branch'ler"

Üç ayrı kariyer hattı vardır ve bunlar **bilinçli olarak birbirine bağlanmaz** — tek bir
"hibrit kimlik" anlatısına zorlanmaz:

| Branch | İçerik | Vurgu rengi |
|---|---|---|
| `data-analytics` | Foneria'daki ana iş: dashboards, anomali tespiti, SQL/Python, ETL | Mavi (`#79c0ff`) |
| `mobile-development` | Üretimde iki platform: SwiftUI (iOS), Jetpack Compose (Android) | Yeşil (`#7ee787`) |
| `ai-engineering` | RAG, MCP, multi-agent sistemler, n8n/Qdrant | Turuncu (`#ffa657`) |

Hero, `git branch -a` çıktısı gibi bu üç hattı listeler; her satır tıklanabilir ve
ziyaretçiyi ilgili hattın bölümüne götürür.

## Görsel Stil: Koyu & Teknik

- Dark tema (GitHub dark paletine yakın: `#0d1117` zemin, `#161b22` kartlar, `#30363d` çerçeveler)
- Monospace vurgular (komut satırları, etiketler), gövde metni sans-serif
- Bölüm başlıkları terminal komutu estetiğinde: `$ ls projects/ --branch=data` gibi
- Terminal/git esprileri her sayfada bir-iki dokunuşla sınırlı — okumayı yormaz
- Tek tema (dark); light mode kapsam dışı (YAGNI)

## Metin Tonu

- Dobra, esprili, savunmasız; "çok yönlülüğü açıklamaya çalışmayan" özgüven
- Git/terminal dili: Hakkımda sayfası kariyer geçmişini `git log` kronolojisi gibi anlatabilir,
  proje detayları commit-log estetiği kullanabilir
- Tüm metinler iki dilde (TR + EN) aynı tonda yazılır

## Site Yapısı

```
/                  Ana sayfa (EN): hero (git branch) → hat bazlı proje grupları →
                   kısa hakkımda → son blog yazıları → iletişim footer
/projects          Tüm projeler, branch'e göre gruplu/filtrelenebilir
/projects/[slug]   Proje detay sayfası
/about             Deneyim, eğitim, sertifikalar, CV indirme (PDF)
/blog              Yazı listesi (branch rengiyle etiketli)
/blog/[slug]       Yazı detayı
/404               Özel 404 sayfası (terminal esprisi: command not found)
/tr/...            Tüm yapının Türkçe karşılığı, aynı ağaç
```

Navigasyonda TR | EN değiştirici; her sayfa karşı dildeki eşine link verir.

## Teknik Mimari

- **Framework:** Astro (statik çıktı, varsayılan sıfır JS)
- **İçerik:** `src/content/` altında Markdown content collections:
  - `projects/` — frontmatter: title, slug, branch (data|mobile|ai), stack, summary, date, lang
  - `blog/` — frontmatter: title, date, branch, lang, description
  - Frontmatter zod şemasıyla doğrulanır; hatalı içerik build'i kırar
- **Stil:** Scoped CSS / global tek tema dosyası; Tailwind yok (tek tema için gereksiz bağımlılık)
- **JS:** Yalnızca gereken yerde (mobil menü, dil değiştirici); kalan her şey statik HTML
- **i18n:** Astro'nun yerleşik i18n routing'i; EN kök, TR `/tr/` prefix'i
- **CV:** `public/cv.pdf` — butonla indirilir

## İlk İçerik (lansman kapsamı)

CV'den uyarlanır, iki dilde:

1. **Projeler (4):** anomaly-detection-engine, fund-discovery-api, foneria-mobile, pdf-pipeline
2. **Hakkımda:** Foneria deneyimi (Data Analyst + intern dönemi), eğitim, sertifikalar
3. **Blog:** 1 örnek yazı (yayın akışını doğrulamak için); sonrası kullanıcıdan Markdown push'u
4. **İletişim:** e-posta, LinkedIn, GitHub linkleri (footer'da, form yok — YAGNI)

## Deploy

- GitHub reposu + GitHub Pages
- GitHub Actions: resmi `withastro/action` ile her push'ta otomatik build & deploy
- Kullanıcının yayın akışı: Markdown yaz → `git push` → site güncellenir

## Hata Yönetimi ve Test

- Build aşaması bozuk Markdown/frontmatter'ı yakalar (zod şema)
- Kırık iç linkler build sırasında kontrol edilir
- Özel 404 sayfası
- Manuel doğrulama: lokal `astro dev` önizleme + deploy sonrası smoke test (her iki dilde
  ana sayfalar, bir proje detayı, bir blog yazısı, CV indirme)

## Kapsam Dışı (bilinçli)

- Light mode / tema değiştirici
- İletişim formu (mailto yeterli)
- CMS, yorum sistemi, analytics (sonradan eklenebilir)
- Harici blog platformu senkronu
