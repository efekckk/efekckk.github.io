# efekckk.github.io

Kişisel portfolyo sitesi — [efekckk.github.io](https://efekckk.github.io). Astro ile
statik, iki dilli (EN kök + TR `/tr/`), GitHub Actions ile otomatik deploy.

## Geliştirme

```bash
npm install
npm run dev      # http://localhost:4321
npm run build    # dist/ üretir
npm test         # i18n yardımcı testleri
```

## İçerik ekleme

Her içerik iki dilde, **aynı dosya adıyla** eklenir (dil değiştirici slug üzerinden eşler):

### Blog yazısı

1. `src/content/blog/en/yazi-adi.md` ve `src/content/blog/tr/yazi-adi.md` oluştur
2. Frontmatter: `title`, `description`, `branch` (`data` | `mobile` | `ai`), `date`
3. `git push` — site otomatik güncellenir

### Proje

1. `src/content/projects/en/proje-adi.md` ve `src/content/projects/tr/proje-adi.md`
2. Frontmatter: `title`, `summary`, `branch`, `stack` (liste), `date`, `order`
3. `git push`

Hatalı frontmatter build'i kırar (zod şeması) — bozuk içerik yayına çıkamaz.

## CV güncelleme

Yeni PDF'i `public/cv.pdf` olarak değiştir, push'la.
