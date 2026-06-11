# Portfolyo Sitesi Implementasyon Planı

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Efecan Küçük için iki dilli (EN kök + TR `/tr/`), "paralel branch'ler" konseptli, koyu/teknik temalı statik portfolyo sitesi — GitHub Pages'te `https://efekck.github.io/` adresinde yayında.

**Architecture:** Astro 5 statik site. İçerik (projeler, blog) Markdown content collections olarak `src/content/` altında, zod şemasıyla doğrulanır. Sayfalar ince sarmalayıcıdır; asıl render `src/components/pages/` altındaki dil-parametreli bileşenlerde yapılır (DRY). Deploy GitHub Actions ile otomatiktir.

**Tech Stack:** Astro ^5, TypeScript (strict), Vitest (i18n yardımcıları için), saf CSS (Tailwind yok), GitHub Pages + `withastro/action`.

**Spec:** `docs/superpowers/specs/2026-06-11-portfolio-site-design.md`

**Çalışma dizini:** Tüm komutlar `/Users/efekck/project/Portfolio` kökünden çalıştırılır.

---

## Dosya Haritası

```
package.json, tsconfig.json, astro.config.mjs
src/
├─ content.config.ts            # zod şemalı collection tanımları
├─ content/
│  ├─ projects/{en,tr}/         # 4 proje × 2 dil
│  └─ blog/{en,tr}/             # 1 yazı × 2 dil
├─ i18n/ui.ts                   # çeviri sözlüğü
├─ i18n/utils.ts                # getLangFromUrl, useTranslations, localizePath, entryLang, entrySlug
├─ data/branches.ts             # branch meta (isim, renk anahtarı, yorum satırları)
├─ styles/global.css            # tek koyu tema
├─ layouts/BaseLayout.astro
├─ components/
│  ├─ Nav.astro, Footer.astro, ProjectCard.astro
│  └─ pages/                    # dil-parametreli sayfa gövdeleri
│     ├─ HomePage.astro, ProjectsPage.astro, ProjectDetailPage.astro
│     ├─ AboutPage.astro, BlogIndexPage.astro, BlogPostPage.astro
└─ pages/
   ├─ index.astro, 404.astro
   ├─ projects/index.astro, projects/[slug].astro
   ├─ about.astro
   ├─ blog/index.astro, blog/[slug].astro
   └─ tr/ (aynı ağacın TR sarmalayıcıları)
tests/i18n.test.ts
public/cv.pdf
.github/workflows/deploy.yml
```

---

### Task 1: Astro proje iskeleti

**Files:**
- Create: `package.json`, `tsconfig.json`, `astro.config.mjs`, `src/pages/index.astro` (geçici)

- [ ] **Step 1: package.json yaz**

```json
{
  "name": "efekck-portfolio",
  "type": "module",
  "version": "1.0.0",
  "private": true,
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "test": "vitest run"
  },
  "dependencies": {
    "astro": "^5.0.0"
  },
  "devDependencies": {
    "vitest": "^3.0.0"
  }
}
```

- [ ] **Step 2: tsconfig.json yaz**

```json
{
  "extends": "astro/tsconfigs/strict",
  "include": [".astro/types.d.ts", "src/**/*", "tests/**/*"],
  "exclude": ["dist"]
}
```

- [ ] **Step 3: astro.config.mjs yaz**

```js
import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://efekck.github.io',
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'tr'],
    routing: { prefixDefaultLocale: false },
  },
});
```

- [ ] **Step 4: Geçici ana sayfa yaz** — `src/pages/index.astro`

```astro
---
---
<html lang="en">
  <head><meta charset="utf-8" /><title>efekck</title></head>
  <body><p>scaffold ok</p></body>
</html>
```

- [ ] **Step 5: Bağımlılıkları kur ve build doğrula**

Çalıştır: `npm install && npm run build`
Beklenen: `npm install` hatasız biter; build çıktısında `1 page(s) built` ve `Complete!` görünür, `dist/index.html` oluşur.

- [ ] **Step 6: Commit**

```bash
git add package.json package-lock.json tsconfig.json astro.config.mjs src/pages/index.astro
git commit -m "feat: scaffold Astro project"
```

---

### Task 2: i18n sözlüğü ve yardımcıları (TDD)

**Files:**
- Create: `src/i18n/ui.ts`, `src/i18n/utils.ts`
- Test: `tests/i18n.test.ts`

- [ ] **Step 1: Failing test yaz** — `tests/i18n.test.ts`

```ts
import { describe, it, expect } from 'vitest';
import {
  getLangFromUrl,
  useTranslations,
  localizePath,
  entryLang,
  entrySlug,
} from '../src/i18n/utils';

describe('getLangFromUrl', () => {
  it('returns tr for /tr/ paths', () => {
    expect(getLangFromUrl(new URL('https://efekck.github.io/tr/projects'))).toBe('tr');
  });
  it('returns en for root paths', () => {
    expect(getLangFromUrl(new URL('https://efekck.github.io/projects'))).toBe('en');
  });
});

describe('useTranslations', () => {
  it('returns the translated string for the given lang', () => {
    const t = useTranslations('tr');
    expect(t('nav.projects')).toBe('Projeler');
  });
  it('falls back to en when key is missing in lang', () => {
    const t = useTranslations('en');
    expect(t('nav.projects')).toBe('Projects');
  });
});

describe('localizePath', () => {
  it('keeps en paths unprefixed', () => {
    expect(localizePath('en', '/projects')).toBe('/projects');
  });
  it('prefixes tr paths', () => {
    expect(localizePath('tr', '/projects')).toBe('/tr/projects');
  });
  it('handles root for tr', () => {
    expect(localizePath('tr', '/')).toBe('/tr/');
  });
});

describe('entry helpers', () => {
  it('extracts lang from collection entry id', () => {
    expect(entryLang('tr/anomaly-detection-engine')).toBe('tr');
    expect(entryLang('en/anomaly-detection-engine')).toBe('en');
  });
  it('strips lang prefix to get slug', () => {
    expect(entrySlug('tr/anomaly-detection-engine')).toBe('anomaly-detection-engine');
  });
});
```

- [ ] **Step 2: Testin FAIL ettiğini doğrula**

Çalıştır: `npm test`
Beklenen: FAIL — `Cannot find module '../src/i18n/utils'` (veya eşdeğeri).

- [ ] **Step 3: src/i18n/ui.ts yaz**

```ts
export const languages = { en: 'EN', tr: 'TR' } as const;
export type Lang = keyof typeof languages;
export const defaultLang: Lang = 'en';

export const ui = {
  en: {
    'nav.projects': 'Projects',
    'nav.about': 'About',
    'nav.blog': 'Blog',
    'meta.home.title': 'Efecan Küçük — data, mobile, AI (each on its own branch)',
    'meta.home.desc':
      'Data analyst, mobile developer and AI engineer. Three parallel careers, zero merge conflicts.',
    'meta.projects.title': 'Projects — Efecan Küçük',
    'meta.projects.desc': 'Production work across data analytics, mobile development and AI engineering.',
    'meta.about.title': 'About — Efecan Küçük',
    'meta.about.desc': 'Career history as a git log: from mechatronics to data, mobile and AI.',
    'meta.blog.title': 'Blog — Efecan Küçük',
    'meta.blog.desc': 'Notes from three branches: data, mobile and AI.',
    'home.cmd.about': '$ cat about.md',
    'home.cmd.blog': '$ tail -3 blog/',
    'home.about.text':
      'Data analyst at Foneria by day. Two production mobile apps on the side. Lately teaching agents to do the boring parts. Three careers, zero merge conflicts — each one gets its own branch.',
    'home.about.link': 'full history →',
    'home.blog.link': 'all posts →',
    'btn.projects': 'Browse projects',
    'btn.cv': 'Download CV (PDF)',
    'projects.cmd': '$ ls projects/ --all',
    'blog.cmd': '$ ls blog/',
    'detail.back': '← back',
    'footer.cmd': '$ contact --email --linkedin --github',
    'hero.checkout': 'git checkout',
    'hero.pick': 'pick a branch above',
  },
  tr: {
    'nav.projects': 'Projeler',
    'nav.about': 'Hakkımda',
    'nav.blog': 'Blog',
    'meta.home.title': 'Efecan Küçük — veri, mobil, AI (her biri kendi branch’inde)',
    'meta.home.desc':
      'Veri analisti, mobil geliştirici ve AI mühendisi. Üç paralel kariyer, sıfır merge conflict.',
    'meta.projects.title': 'Projeler — Efecan Küçük',
    'meta.projects.desc': 'Veri analitiği, mobil geliştirme ve AI mühendisliğinde üretim işleri.',
    'meta.about.title': 'Hakkımda — Efecan Küçük',
    'meta.about.desc': 'Git log formatında kariyer geçmişi: mekatronikten veriye, mobile ve AI’a.',
    'meta.blog.title': 'Blog — Efecan Küçük',
    'meta.blog.desc': 'Üç branch’ten notlar: veri, mobil ve AI.',
    'home.cmd.about': '$ cat hakkimda.md',
    'home.cmd.blog': '$ tail -3 blog/',
    'home.about.text':
      'Gündüzleri Foneria’da veri analisti. Yanda üretimde iki mobil uygulama. Son zamanlarda sıkıcı işleri agent’lara öğretiyorum. Üç kariyer, sıfır merge conflict — her biri kendi branch’inde.',
    'home.about.link': 'tüm geçmiş →',
    'home.blog.link': 'tüm yazılar →',
    'btn.projects': 'Projelere bak',
    'btn.cv': 'CV indir (PDF)',
    'projects.cmd': '$ ls projeler/ --hepsi',
    'blog.cmd': '$ ls blog/',
    'detail.back': '← geri',
    'footer.cmd': '$ iletisim --eposta --linkedin --github',
    'hero.checkout': 'git checkout',
    'hero.pick': 'yukarıdan bir branch seç',
  },
} as const;

export type UiKey = keyof (typeof ui)['en'];
```

- [ ] **Step 4: src/i18n/utils.ts yaz**

```ts
import { ui, defaultLang, type Lang, type UiKey } from './ui';

export function getLangFromUrl(url: URL): Lang {
  const [, first] = url.pathname.split('/');
  return first === 'tr' ? 'tr' : defaultLang;
}

export function useTranslations(lang: Lang) {
  return function t(key: UiKey): string {
    return ui[lang][key] ?? ui[defaultLang][key];
  };
}

export function localizePath(lang: Lang, path: string): string {
  if (lang === defaultLang) return path;
  return path === '/' ? '/tr/' : `/tr${path}`;
}

export function otherLang(lang: Lang): Lang {
  return lang === 'en' ? 'tr' : 'en';
}

export function entryLang(id: string): Lang {
  return id.startsWith('tr/') ? 'tr' : 'en';
}

export function entrySlug(id: string): string {
  return id.replace(/^(en|tr)\//, '');
}
```

- [ ] **Step 5: Testin PASS ettiğini doğrula**

Çalıştır: `npm test`
Beklenen: PASS — 9 test geçer.

- [ ] **Step 6: Commit**

```bash
git add src/i18n/ tests/
git commit -m "feat: add i18n dictionary and helpers with tests"
```

---

### Task 3: Tema CSS, BaseLayout, Nav, Footer

**Files:**
- Create: `src/styles/global.css`, `src/layouts/BaseLayout.astro`, `src/components/Nav.astro`, `src/components/Footer.astro`, `src/data/branches.ts`
- Modify: `src/pages/index.astro` (geçici sayfayı layout'a bağla)

- [ ] **Step 1: src/data/branches.ts yaz**

```ts
import type { Lang } from '../i18n/ui';

export type BranchKey = 'data' | 'mobile' | 'ai';

export const branchKeys: BranchKey[] = ['data', 'mobile', 'ai'];

export const branches: Record<
  BranchKey,
  { name: string; anchor: string; comment: Record<Lang, string> }
> = {
  data: {
    name: 'data-analytics',
    anchor: 'data-analytics',
    comment: {
      en: "# full-time at Foneria — dashboards, anomaly detection, SQL",
      tr: "# Foneria'da full-time — dashboard'lar, anomali tespiti, SQL",
    },
  },
  mobile: {
    name: 'mobile-development',
    anchor: 'mobile-development',
    comment: {
      en: '# two platforms in production — SwiftUI & Jetpack Compose',
      tr: '# üretimde iki platform — SwiftUI & Jetpack Compose',
    },
  },
  ai: {
    name: 'ai-engineering',
    anchor: 'ai-engineering',
    comment: {
      en: '# RAG, MCP, multi-agent — the branch pointed at the future',
      tr: '# RAG, MCP, multi-agent — geleceğe açılan branch',
    },
  },
};
```

- [ ] **Step 2: src/styles/global.css yaz**

```css
:root {
  --bg: #0d1117;
  --surface: #161b22;
  --border: #30363d;
  --text: #e6edf3;
  --muted: #8b949e;
  --faint: #484f58;
  --data: #79c0ff;
  --mobile: #7ee787;
  --ai: #ffa657;
  --accent: #58a6ff;
  --prompt: #7ee787;
  --btn: #238636;
  --mono: ui-monospace, 'SF Mono', Menlo, Consolas, monospace;
  --sans: -apple-system, BlinkMacSystemFont, 'Segoe UI', Helvetica, Arial, sans-serif;
}

* { box-sizing: border-box; }

html { background: var(--bg); color: var(--text); font-family: var(--sans); }
body { margin: 0; line-height: 1.6; }

a { color: var(--accent); text-decoration: none; }
a:hover { text-decoration: underline; }

.mono { font-family: var(--mono); }

.container { max-width: 880px; margin: 0 auto; padding: 0 24px; }

/* nav */
.nav {
  display: flex; justify-content: space-between; align-items: center;
  max-width: 880px; margin: 0 auto; padding: 18px 24px;
  border-bottom: 1px solid var(--border);
}
.nav .logo { color: var(--prompt); font-size: 14px; }
.nav nav { display: flex; gap: 18px; align-items: center; font-size: 14px; }
.nav nav a { color: var(--muted); }
.nav nav a:hover { color: var(--text); text-decoration: none; }
.nav .lang-switch {
  border: 1px solid var(--border); border-radius: 6px;
  padding: 2px 10px; color: var(--accent); font-size: 12px;
}

/* terminal hero */
.terminal {
  background: var(--surface); border: 1px solid var(--border); border-radius: 10px;
  padding: 24px; margin-top: 40px; font-size: 14px; overflow-x: auto;
}
.terminal .prompt { color: var(--prompt); }
.terminal .cursor { color: var(--accent); animation: blink 1.2s step-end infinite; }
@keyframes blink { 50% { opacity: 0; } }
.branch-line {
  display: block; padding: 4px 0; color: var(--text); white-space: nowrap;
}
.branch-line:hover { text-decoration: none; background: rgba(88, 166, 255, 0.06); }
.branch-line .star { color: var(--prompt); margin-right: 6px; }
.branch-line[data-branch='data'] .branch-name { color: var(--data); }
.branch-line[data-branch='mobile'] .branch-name { color: var(--mobile); }
.branch-line[data-branch='ai'] .branch-name { color: var(--ai); }
.branch-line .branch-comment { color: var(--faint); font-size: 12px; margin-left: 12px; }
.hero-actions { display: flex; gap: 10px; margin: 24px 0 8px; }

/* buttons */
.btn {
  display: inline-block; border: 1px solid var(--border); border-radius: 6px;
  padding: 9px 18px; font-size: 14px; color: var(--text);
}
.btn:hover { text-decoration: none; border-color: var(--muted); }
.btn-primary { background: var(--btn); border-color: var(--btn); color: #fff; }

/* section headings as commands */
.cmd { font-family: var(--mono); font-size: 14px; color: var(--prompt); font-weight: 400; margin: 48px 0 16px; }
.cmd .cmd-note { color: var(--faint); font-size: 12px; }

/* cards */
.grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
@media (max-width: 640px) { .grid { grid-template-columns: 1fr; } }
.card {
  display: block; background: var(--surface); border: 1px solid var(--border);
  border-radius: 8px; padding: 16px; color: var(--text);
}
.card:hover { text-decoration: none; border-color: var(--muted); }
.card-title { margin: 0; font-size: 15px; }
.card[data-branch='data'] .card-title { color: var(--data); }
.card[data-branch='mobile'] .card-title { color: var(--mobile); }
.card[data-branch='ai'] .card-title { color: var(--ai); }
.card-summary { font-size: 13px; color: var(--muted); margin: 8px 0 0; }
.card-stack { font-size: 11px; color: var(--faint); margin-top: 10px; }

/* lists (blog) */
.post-row {
  display: flex; justify-content: space-between; gap: 16px;
  padding: 10px 0; border-bottom: 1px solid var(--border); color: var(--text); font-size: 14px;
}
.post-row:hover { text-decoration: none; color: var(--accent); }
.post-row .post-date { color: var(--faint); font-size: 12px; white-space: nowrap; }
.post-row[data-branch='data'] .post-tag { color: var(--data); }
.post-row[data-branch='mobile'] .post-tag { color: var(--mobile); }
.post-row[data-branch='ai'] .post-tag { color: var(--ai); }
.post-tag { font-family: var(--mono); font-size: 11px; margin-right: 10px; }

/* detail pages & prose */
.detail h1 { font-size: 26px; margin: 40px 0 4px; }
.detail[data-branch='data'] h1 { color: var(--data); }
.detail[data-branch='mobile'] h1 { color: var(--mobile); }
.detail[data-branch='ai'] h1 { color: var(--ai); }
.detail .stack { color: var(--faint); font-size: 12px; margin-bottom: 24px; }
.prose { max-width: 680px; }
.prose h2 { font-size: 18px; margin-top: 32px; }
.prose code {
  background: var(--surface); border: 1px solid var(--border);
  border-radius: 4px; padding: 1px 6px; font-size: 13px; font-family: var(--mono);
}
.prose pre {
  background: var(--surface); border: 1px solid var(--border); border-radius: 8px;
  padding: 16px; overflow-x: auto; font-size: 13px;
}
.prose pre code { background: none; border: none; padding: 0; }

/* about: git log */
.log-row { display: flex; gap: 14px; padding: 8px 0; font-size: 14px; align-items: baseline; }
.log-hash { font-family: var(--mono); color: var(--ai); font-size: 12px; flex-shrink: 0; }
.log-year { font-family: var(--mono); color: var(--faint); font-size: 12px; flex-shrink: 0; width: 48px; }

/* footer */
.footer {
  max-width: 880px; margin: 64px auto 0; padding: 24px;
  border-top: 1px solid var(--border);
  display: flex; justify-content: space-between; gap: 16px; flex-wrap: wrap;
  font-size: 13px; color: var(--muted);
}
.footer .footer-cmd { font-family: var(--mono); color: var(--prompt); font-size: 12px; }
```

- [ ] **Step 3: src/layouts/BaseLayout.astro yaz**

```astro
---
import '../styles/global.css';
import Nav from '../components/Nav.astro';
import Footer from '../components/Footer.astro';
import type { Lang } from '../i18n/ui';

interface Props {
  lang: Lang;
  title: string;
  description: string;
  altPath: string;
}
const { lang, title, description, altPath } = Astro.props;
---
<!doctype html>
<html lang={lang}>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content={description} />
    <meta name="generator" content={Astro.generator} />
    <title>{title}</title>
  </head>
  <body>
    <Nav lang={lang} altPath={altPath} />
    <main class="container">
      <slot />
    </main>
    <Footer lang={lang} />
  </body>
</html>
```

- [ ] **Step 4: src/components/Nav.astro yaz**

```astro
---
import { useTranslations, localizePath, otherLang } from '../i18n/utils';
import type { Lang } from '../i18n/ui';

interface Props { lang: Lang; altPath: string; }
const { lang, altPath } = Astro.props;
const t = useTranslations(lang);
---
<header class="nav">
  <a class="logo mono" href={localizePath(lang, '/')}>~/efecan</a>
  <nav>
    <a href={localizePath(lang, '/projects')}>{t('nav.projects')}</a>
    <a href={localizePath(lang, '/about')}>{t('nav.about')}</a>
    <a href={localizePath(lang, '/blog')}>{t('nav.blog')}</a>
    <a class="lang-switch mono" href={altPath}>{otherLang(lang).toUpperCase()}</a>
  </nav>
</header>
```

- [ ] **Step 5: src/components/Footer.astro yaz**

```astro
---
import { useTranslations } from '../i18n/utils';
import type { Lang } from '../i18n/ui';

interface Props { lang: Lang; }
const { lang } = Astro.props;
const t = useTranslations(lang);
---
<footer class="footer">
  <span class="footer-cmd">{t('footer.cmd')}</span>
  <span>
    <a href="mailto:efe.kckk@gmail.com">efe.kckk@gmail.com</a>
    &nbsp;·&nbsp;
    <a href="https://www.linkedin.com/in/efecankucuk/">LinkedIn</a>
    &nbsp;·&nbsp;
    <a href="https://github.com/efekck">GitHub</a>
  </span>
</footer>
```

- [ ] **Step 6: Geçici index'i layout'a bağla** — `src/pages/index.astro` dosyasının tamamını şununla değiştir:

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout lang="en" title="efekck" description="scaffold" altPath="/tr/">
  <p>layout ok</p>
</BaseLayout>
```

- [ ] **Step 7: Build doğrula**

Çalıştır: `npm run build`
Beklenen: hatasız, `1 page(s) built`.

- [ ] **Step 8: Commit**

```bash
git add src/styles/ src/layouts/ src/components/ src/data/ src/pages/index.astro
git commit -m "feat: add dark theme, base layout, nav and footer"
```

---

### Task 4: Content collections + proje içerikleri

**Files:**
- Create: `src/content.config.ts`, `src/content/projects/en/*.md` (4), `src/content/projects/tr/*.md` (4)

- [ ] **Step 1: src/content.config.ts yaz**

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const branchEnum = z.enum(['data', 'mobile', 'ai']);

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    branch: branchEnum,
    stack: z.array(z.string()),
    date: z.date(),
    order: z.number(),
  }),
});

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    branch: branchEnum,
    date: z.date(),
  }),
});

export const collections = { projects, blog };
```

- [ ] **Step 2: EN proje dosyalarını yaz**

`src/content/projects/en/anomaly-detection-engine.md`:

```md
---
title: anomaly-detection-engine
summary: Three-layer real-time monitoring for financial streams. Modified Z-Score over MAD with day-parting baselines — 60% fewer false positives.
branch: data
stack: [React, NestJS, PostgreSQL, OpenRouter]
date: 2025-09-01
order: 1
---

Financial metrics are noisy on purpose: Mondays don't look like Fridays, 9 AM doesn't
look like midnight, and a classic z-score panics at every payday. This engine watches
real-time financial streams without crying wolf.

## How it works

Three layers: ingest, statistics, insight. The statistics layer uses a **Modified
Z-Score built on MAD** (Median Absolute Deviation) instead of standard deviation, so a
single whale transaction can't drag the baseline. Day-of-week normalized baselines and
same-hour comparison handle weekly seasonality. Result: **60% fewer false positives**
than the naive approach it replaced.

## The insight layer

When something *does* fire, GPT-4 (via OpenRouter) gets the alert plus cross-metric
context — net flow vs. cash out, funnel conversion ratios — and writes a human-readable
root cause analysis. The on-call human reads a paragraph, not a wall of numbers.
```

`src/content/projects/en/fund-discovery-api.md`:

```md
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
```

`src/content/projects/en/foneria-mobile.md`:

```md
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
```

`src/content/projects/en/pdf-pipeline.md`:

```md
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
```

- [ ] **Step 3: TR proje dosyalarını yaz**

`src/content/projects/tr/anomaly-detection-engine.md`:

```md
---
title: anomaly-detection-engine
summary: Finansal akışlar için 3 katmanlı gerçek zamanlı izleme. MAD üzerine Modified Z-Score ve day-parting baseline'lar — %60 daha az false positive.
branch: data
stack: [React, NestJS, PostgreSQL, OpenRouter]
date: 2025-09-01
order: 1
---

Finansal metrikler bilerek gürültülüdür: pazartesi cumaya benzemez, sabah 9 gece
yarısına benzemez ve klasik z-score her maaş gününde panik atak geçirir. Bu motor,
gerçek zamanlı finansal akışları kurt geliyor diye bağırmadan izler.

## Nasıl çalışıyor

Üç katman: veri alımı, istatistik, içgörü. İstatistik katmanı standart sapma yerine
**MAD (Median Absolute Deviation) üzerine kurulu Modified Z-Score** kullanır — tek bir
balina işlemi baseline'ı sürükleyemez. Haftanın gününe göre normalize edilmiş
baseline'lar ve aynı-saat karşılaştırması haftalık mevsimselliği çözer. Sonuç:
yerini aldığı naif yaklaşıma göre **%60 daha az false positive**.

## İçgörü katmanı

Bir alarm gerçekten öttüğünde, GPT-4 (OpenRouter üzerinden) alarmı ve metrikler arası
bağlamı alır — net akış vs. çıkış, funnel dönüşüm oranları — ve insan diliyle bir kök
neden analizi yazar. Nöbetçi insan sayı duvarı değil, bir paragraf okur.
```

`src/content/projects/tr/fund-discovery-api.md`:

```md
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
```

`src/content/projects/tr/foneria-mobile.md`:

```md
---
title: foneria-mobile
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
```

`src/content/projects/tr/pdf-pipeline.md`:

```md
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
```

- [ ] **Step 4: Build ile şema doğrulamasını test et**

Çalıştır: `npm run build`
Beklenen: hatasız build (collections henüz hiçbir sayfada kullanılmıyor ama frontmatter şemaya karşı derlenir).

Ek doğrulama — şemanın gerçekten çalıştığını kanıtla: `src/content/projects/en/anomaly-detection-engine.md` içindeki `branch: data` satırını geçici olarak `branch: yanlis` yap, `npm run build` çalıştır.
Beklenen: build FAIL — zod enum hatası. Sonra satırı `branch: data` olarak geri al ve build'in tekrar geçtiğini doğrula.

- [ ] **Step 5: Commit**

```bash
git add src/content.config.ts src/content/projects/
git commit -m "feat: add content collections with four projects in two languages"
```

---

### Task 5: Blog içeriği

**Files:**
- Create: `src/content/blog/en/why-mad.md`, `src/content/blog/tr/why-mad.md`

- [ ] **Step 1: EN yazıyı yaz** — `src/content/blog/en/why-mad.md`

````md
---
title: Why MAD instead of standard deviation?
description: The one-line change that cut our anomaly false positives by 60%.
branch: data
date: 2026-05-10
---

Standard deviation has a design flaw for anomaly detection: the anomaly you're trying
to catch is *inside* the calculation. One whale transaction inflates σ, the threshold
stretches, and the next three real anomalies walk through undetected.

**MAD — Median Absolute Deviation — doesn't have that problem.** Medians don't care
about your whale.

```python
median = np.median(x)
mad = np.median(np.abs(x - median))
modified_z = 0.6745 * (x - median) / mad
```

The `0.6745` constant makes MAD comparable to σ for normal distributions, so the usual
"flag at 3.5" rule still reads naturally.

In our production monitoring this swap — plus day-of-week baselines — cut false
positives by 60%. The on-call phone got quieter. Nobody missed the old math.
````

- [ ] **Step 2: TR yazıyı yaz** — `src/content/blog/tr/why-mad.md`

````md
---
title: Standart sapma yerine neden MAD?
description: Anomali false positive'lerimizi %60 azaltan tek satırlık değişiklik.
branch: data
date: 2026-05-10
---

Standart sapmanın anomali tespiti için bir tasarım hatası var: yakalamaya çalıştığın
anomali, hesabın *içinde*. Tek bir balina işlemi σ'yı şişirir, eşik esner ve sıradaki
üç gerçek anomali görünmeden içeri yürür.

**MAD — Median Absolute Deviation — bu dertten muaf.** Medyanın senin balinanla işi
olmaz.

```python
median = np.median(x)
mad = np.median(np.abs(x - median))
modified_z = 0.6745 * (x - median) / mad
```

`0.6745` sabiti, normal dağılımlarda MAD'i σ ile karşılaştırılabilir yapar; alışıldık
"3.5'te işaretle" kuralı aynen okunmaya devam eder.

Üretimdeki izleme sistemimizde bu değişiklik — artı haftanın gününe göre baseline'lar —
false positive'leri %60 azalttı. Nöbet telefonu sessizleşti. Eski matematiği özleyen
olmadı.
````

- [ ] **Step 2.5: Build doğrula**

Çalıştır: `npm run build`
Beklenen: hatasız.

- [ ] **Step 3: Commit**

```bash
git add src/content/blog/
git commit -m "feat: add first blog post in two languages"
```

---

### Task 6: Ana sayfa (hero + branch bölümleri + şeritler)

**Files:**
- Create: `src/components/ProjectCard.astro`, `src/components/pages/HomePage.astro`, `src/pages/tr/index.astro`
- Modify: `src/pages/index.astro`

- [ ] **Step 1: src/components/ProjectCard.astro yaz**

```astro
---
import type { CollectionEntry } from 'astro:content';
import { entrySlug, localizePath } from '../i18n/utils';
import type { Lang } from '../i18n/ui';

interface Props { project: CollectionEntry<'projects'>; lang: Lang; }
const { project, lang } = Astro.props;
const { title, summary, stack, branch } = project.data;
const href = localizePath(lang, `/projects/${entrySlug(project.id)}`);
---
<a class="card" data-branch={branch} href={href}>
  <h3 class="card-title">{title}</h3>
  <p class="card-summary">{summary}</p>
  <div class="card-stack mono">{stack.join(' · ')}</div>
</a>
```

- [ ] **Step 2: src/components/pages/HomePage.astro yaz**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import ProjectCard from '../ProjectCard.astro';
import { branches, branchKeys } from '../../data/branches';
import { useTranslations, localizePath, otherLang, entrySlug } from '../../i18n/utils';
import type { Lang } from '../../i18n/ui';

interface Props { lang: Lang; }
const { lang } = Astro.props;
const t = useTranslations(lang);

const projects = (await getCollection('projects', (e) => e.id.startsWith(`${lang}/`)))
  .sort((a, b) => a.data.order - b.data.order);
const posts = (await getCollection('blog', (e) => e.id.startsWith(`${lang}/`)))
  .sort((a, b) => b.data.date.getTime() - a.data.date.getTime())
  .slice(0, 3);

const dateFmt = new Intl.DateTimeFormat(lang === 'tr' ? 'tr-TR' : 'en-US', {
  year: 'numeric',
  month: 'short',
});
---
<BaseLayout
  lang={lang}
  title={t('meta.home.title')}
  description={t('meta.home.desc')}
  altPath={localizePath(otherLang(lang), '/')}
>
  <section class="terminal mono">
    <div class="prompt">efecan@istanbul ~ $ git branch -a</div>
    {branchKeys.map((key) => (
      <a class="branch-line" data-branch={key} href={`#${branches[key].anchor}`}>
        <span class="star">{key === 'data' ? '*' : ' '}</span>
        <span class="branch-name">{branches[key].name}</span>
        <span class="branch-comment">{branches[key].comment[lang]}</span>
      </a>
    ))}
    <div class="prompt">
      efecan@istanbul ~ $ {t('hero.checkout')}
      <span class="branch-comment">&lt;{t('hero.pick')}&gt;</span>
      <span class="cursor">▊</span>
    </div>
  </section>

  <div class="hero-actions">
    <a class="btn btn-primary" href={localizePath(lang, '/projects')}>{t('btn.projects')}</a>
    <a class="btn" href="/cv.pdf" download>{t('btn.cv')}</a>
  </div>

  {branchKeys.map((key) => {
    const list = projects.filter((p) => p.data.branch === key);
    return (
      <section id={branches[key].anchor}>
        <h2 class="cmd">$ ls projects/ --branch={branches[key].name}</h2>
        <div class="grid">
          {list.map((p) => <ProjectCard project={p} lang={lang} />)}
        </div>
      </section>
    );
  })}

  <section>
    <h2 class="cmd">{t('home.cmd.about')}</h2>
    <p style="max-width: 620px; color: var(--muted); font-size: 15px;">
      {t('home.about.text')}
    </p>
    <a href={localizePath(lang, '/about')}>{t('home.about.link')}</a>
  </section>

  <section>
    <h2 class="cmd">{t('home.cmd.blog')}</h2>
    {posts.map((post) => (
      <a
        class="post-row"
        data-branch={post.data.branch}
        href={localizePath(lang, `/blog/${entrySlug(post.id)}`)}
      >
        <span>
          <span class="post-tag">[{post.data.branch}]</span>
          {post.data.title}
        </span>
        <span class="post-date mono">{dateFmt.format(post.data.date)}</span>
      </a>
    ))}
    <p><a href={localizePath(lang, '/blog')}>{t('home.blog.link')}</a></p>
  </section>
</BaseLayout>
```

- [ ] **Step 3: src/pages/index.astro dosyasının tamamını değiştir**

```astro
---
import HomePage from '../components/pages/HomePage.astro';
---
<HomePage lang="en" />
```

- [ ] **Step 4: src/pages/tr/index.astro yaz**

```astro
---
import HomePage from '../../components/pages/HomePage.astro';
---
<HomePage lang="tr" />
```

- [ ] **Step 5: Build doğrula**

Çalıştır: `npm run build`
Beklenen: hatasız, `2 page(s) built`. `dist/index.html` içinde `git branch -a` ve `dist/tr/index.html` içinde `Foneria'da full-time` metni geçer:
`grep -l "git branch -a" dist/index.html && grep -l "full-time" dist/tr/index.html`

- [ ] **Step 6: Commit**

```bash
git add src/components/ src/pages/
git commit -m "feat: add homepage with git-branch hero and branch sections"
```

---

### Task 7: Projeler listesi ve detay sayfaları

**Files:**
- Create: `src/components/pages/ProjectsPage.astro`, `src/components/pages/ProjectDetailPage.astro`, `src/pages/projects/index.astro`, `src/pages/projects/[slug].astro`, `src/pages/tr/projects/index.astro`, `src/pages/tr/projects/[slug].astro`

- [ ] **Step 1: src/components/pages/ProjectsPage.astro yaz**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import ProjectCard from '../ProjectCard.astro';
import { branches, branchKeys } from '../../data/branches';
import { useTranslations, localizePath, otherLang } from '../../i18n/utils';
import type { Lang } from '../../i18n/ui';

interface Props { lang: Lang; }
const { lang } = Astro.props;
const t = useTranslations(lang);

const projects = (await getCollection('projects', (e) => e.id.startsWith(`${lang}/`)))
  .sort((a, b) => a.data.order - b.data.order);
---
<BaseLayout
  lang={lang}
  title={t('meta.projects.title')}
  description={t('meta.projects.desc')}
  altPath={localizePath(otherLang(lang), '/projects')}
>
  <h1 class="cmd" style="margin-top: 40px;">{t('projects.cmd')}</h1>
  {branchKeys.map((key) => {
    const list = projects.filter((p) => p.data.branch === key);
    return (
      <section>
        <h2 class="cmd">--branch={branches[key].name}</h2>
        <div class="grid">
          {list.map((p) => <ProjectCard project={p} lang={lang} />)}
        </div>
      </section>
    );
  })}
</BaseLayout>
```

- [ ] **Step 2: src/components/pages/ProjectDetailPage.astro yaz**

```astro
---
import { render } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import { useTranslations, localizePath, otherLang, entrySlug } from '../../i18n/utils';
import type { Lang } from '../../i18n/ui';

interface Props { lang: Lang; project: CollectionEntry<'projects'>; }
const { lang, project } = Astro.props;
const t = useTranslations(lang);
const { Content } = await render(project);
const slug = entrySlug(project.id);
---
<BaseLayout
  lang={lang}
  title={`${project.data.title} — Efecan Küçük`}
  description={project.data.summary}
  altPath={localizePath(otherLang(lang), `/projects/${slug}`)}
>
  <article class="detail" data-branch={project.data.branch}>
    <p style="margin-top: 32px;">
      <a class="mono" href={localizePath(lang, '/projects')}>{t('detail.back')}</a>
    </p>
    <h1>{project.data.title}</h1>
    <div class="stack mono">{project.data.stack.join(' · ')}</div>
    <div class="prose">
      <Content />
    </div>
  </article>
</BaseLayout>
```

- [ ] **Step 3: EN sayfaları yaz**

`src/pages/projects/index.astro`:

```astro
---
import ProjectsPage from '../../components/pages/ProjectsPage.astro';
---
<ProjectsPage lang="en" />
```

`src/pages/projects/[slug].astro`:

```astro
---
import { getCollection } from 'astro:content';
import ProjectDetailPage from '../../components/pages/ProjectDetailPage.astro';
import { entrySlug } from '../../i18n/utils';

export async function getStaticPaths() {
  const projects = await getCollection('projects', (e) => e.id.startsWith('en/'));
  return projects.map((project) => ({
    params: { slug: entrySlug(project.id) },
    props: { project },
  }));
}
const { project } = Astro.props;
---
<ProjectDetailPage lang="en" project={project} />
```

- [ ] **Step 4: TR sayfaları yaz**

`src/pages/tr/projects/index.astro`:

```astro
---
import ProjectsPage from '../../../components/pages/ProjectsPage.astro';
---
<ProjectsPage lang="tr" />
```

`src/pages/tr/projects/[slug].astro`:

```astro
---
import { getCollection } from 'astro:content';
import ProjectDetailPage from '../../../components/pages/ProjectDetailPage.astro';
import { entrySlug } from '../../../i18n/utils';

export async function getStaticPaths() {
  const projects = await getCollection('projects', (e) => e.id.startsWith('tr/'));
  return projects.map((project) => ({
    params: { slug: entrySlug(project.id) },
    props: { project },
  }));
}
const { project } = Astro.props;
---
<ProjectDetailPage lang="tr" project={project} />
```

- [ ] **Step 5: Build doğrula**

Çalıştır: `npm run build`
Beklenen: hatasız, `12 page(s) built` (2 ana sayfa + 2 liste + 8 detay). `ls dist/projects/` çıktısında 4 proje klasörü + index.html görünür.

- [ ] **Step 6: Commit**

```bash
git add src/components/pages/ src/pages/projects/ src/pages/tr/projects/
git commit -m "feat: add project list and detail pages"
```

---

### Task 8: Hakkımda sayfası + CV PDF

**Files:**
- Create: `src/components/pages/AboutPage.astro`, `src/pages/about.astro`, `src/pages/tr/about.astro`, `public/cv.pdf`

- [ ] **Step 1: src/components/pages/AboutPage.astro yaz**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { useTranslations, localizePath, otherLang } from '../../i18n/utils';
import type { Lang } from '../../i18n/ui';

interface Props { lang: Lang; }
const { lang } = Astro.props;
const t = useTranslations(lang);

const log: { hash: string; year: string; text: Record<Lang, string> }[] = [
  {
    hash: 'a3f9c21',
    year: '2019',
    text: {
      en: 'init — Mechatronics Engineering @ Piri Reis University. Math, programming fundamentals, system dynamics.',
      tr: 'init — Piri Reis Üniversitesi, Mekatronik Mühendisliği. Matematik, programlama temelleri, sistem dinamiği.',
    },
  },
  {
    hash: 'b7e2d54',
    year: '2024',
    text: {
      en: 'feat(edu): Web Design & Coding @ Istanbul University — associate degree, 2024–2026.',
      tr: 'feat(edu): İstanbul Üniversitesi, Web Tasarım ve Kodlama — önlisans, 2024–2026.',
    },
  },
  {
    hash: 'c1a8f03',
    year: '2024',
    text: {
      en: 'feat: joined Foneria as Data Analyst Intern. Cleaned multi-source data, automated daily reports with SQL.',
      tr: 'feat: Foneria’ya Data Analyst Intern olarak katıldım. Çok kaynaklı veriyi temizledim, günlük raporları SQL ile otomatikleştirdim.',
    },
  },
  {
    hash: 'd9c4b72',
    year: '2025',
    text: {
      en: 'feat!: promoted to Data Analyst. SQL/Python analyses, Power BI & Looker dashboards, CLTV/RFM segmentation, KAP data pipelines.',
      tr: 'feat!: Data Analyst’e terfi. SQL/Python analizleri, Power BI & Looker dashboard’ları, CLTV/RFM segmentasyonu, KAP veri pipeline’ları.',
    },
  },
  {
    hash: 'e5d1a98',
    year: '2025',
    text: {
      en: 'branch data-analytics: real-time anomaly detection engine; Airflow ETL with an 80% performance gain.',
      tr: 'branch data-analytics: gerçek zamanlı anomali tespit motoru; %80 performans kazançlı Airflow ETL.',
    },
  },
  {
    hash: 'f2b6c40',
    year: '2026',
    text: {
      en: 'branch mobile-development: Foneria’s investment app in production on iOS (SwiftUI) and Android (Jetpack Compose).',
      tr: 'branch mobile-development: Foneria’nın yatırım uygulaması iOS (SwiftUI) ve Android (Jetpack Compose) üzerinde üretimde.',
    },
  },
  {
    hash: '0a7e3d5',
    year: '2026',
    text: {
      en: 'branch ai-engineering: fund discovery API, RAG & MCP frameworks, n8n + Qdrant pipelines, multi-agent architecture in design.',
      tr: 'branch ai-engineering: fon keşif API’si, RAG & MCP framework’leri, n8n + Qdrant pipeline’ları, tasarımda multi-agent mimari.',
    },
  },
];

const certs = [
  'Python for Data Science and Machine Learning — Certificate Program',
  'Associate Data Scientist in Python — Datacamp',
  'Intermediate SQL — Datacamp',
];

const intro: Record<Lang, string> = {
  en: 'The short version: I never picked one lane. The long version is below, in chronological order, the way git intended.',
  tr: 'Kısa versiyon: hiçbir zaman tek şerit seçmedim. Uzun versiyon aşağıda, kronolojik sırayla — git’in emrettiği gibi.',
};
---
<BaseLayout
  lang={lang}
  title={t('meta.about.title')}
  description={t('meta.about.desc')}
  altPath={localizePath(otherLang(lang), '/about')}
>
  <h1 class="cmd" style="margin-top: 40px;">$ git log --reverse career</h1>
  <p style="max-width: 620px; color: var(--muted); font-size: 15px;">{intro[lang]}</p>

  <section>
    {log.map((entry) => (
      <div class="log-row">
        <span class="log-hash">{entry.hash}</span>
        <span class="log-year">{entry.year}</span>
        <span>{entry.text[lang]}</span>
      </div>
    ))}
  </section>

  <section>
    <h2 class="cmd">$ ls certificates/</h2>
    <ul style="color: var(--muted); font-size: 14px;">
      {certs.map((c) => <li>{c}</li>)}
    </ul>
  </section>

  <section style="margin-top: 32px;">
    <a class="btn btn-primary" href="/cv.pdf" download>{t('btn.cv')}</a>
  </section>
</BaseLayout>
```

- [ ] **Step 2: Sayfa sarmalayıcılarını yaz**

`src/pages/about.astro`:

```astro
---
import AboutPage from '../components/pages/AboutPage.astro';
---
<AboutPage lang="en" />
```

`src/pages/tr/about.astro`:

```astro
---
import AboutPage from '../../components/pages/AboutPage.astro';
---
<AboutPage lang="tr" />
```

- [ ] **Step 3: CV PDF'ini üret** — sistemde pdflatex yok; tectonic kur ve derle:

```bash
brew install tectonic
mkdir -p public
tectonic --outdir public /Users/efekck/project/cv.tex
ls -la public/cv.pdf
```

Beklenen: `public/cv.pdf` oluşur (tectonic çıktı adını kaynak dosyadan alır: `cv.pdf`).
**Fallback:** `brew install tectonic` başarısız olursa veya derleme hata verirse bu adımı atla, `public/cv.pdf` yerine geçici olarak boş olmayan bir uyarı PDF'i koyma — bunun yerine kullanıcıya şu notu ilet: "cv.tex'i Overleaf'te derleyip çıktıyı `public/cv.pdf` olarak kaydetmen gerekiyor." ve bu task'ın commit'inde `public/cv.pdf` olmadan devam et (CV butonu deploy sonrası 404 verir; kullanıcı PDF'i ekleyince düzelir — bu durumu final rapora yaz).

- [ ] **Step 4: Build doğrula**

Çalıştır: `npm run build`
Beklenen: hatasız, `14 page(s) built`. `public/cv.pdf` varsa `dist/cv.pdf` de oluşur: `ls dist/cv.pdf`

- [ ] **Step 5: Commit**

```bash
git add src/components/pages/AboutPage.astro src/pages/about.astro src/pages/tr/about.astro
git add public/cv.pdf 2>/dev/null || true
git commit -m "feat: add about page with git-log career history and CV download"
```

---

### Task 9: Blog listesi ve yazı sayfaları

**Files:**
- Create: `src/components/pages/BlogIndexPage.astro`, `src/components/pages/BlogPostPage.astro`, `src/pages/blog/index.astro`, `src/pages/blog/[slug].astro`, `src/pages/tr/blog/index.astro`, `src/pages/tr/blog/[slug].astro`

- [ ] **Step 1: src/components/pages/BlogIndexPage.astro yaz**

```astro
---
import { getCollection } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import { useTranslations, localizePath, otherLang, entrySlug } from '../../i18n/utils';
import type { Lang } from '../../i18n/ui';

interface Props { lang: Lang; }
const { lang } = Astro.props;
const t = useTranslations(lang);

const posts = (await getCollection('blog', (e) => e.id.startsWith(`${lang}/`)))
  .sort((a, b) => b.data.date.getTime() - a.data.date.getTime());

const dateFmt = new Intl.DateTimeFormat(lang === 'tr' ? 'tr-TR' : 'en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});
---
<BaseLayout
  lang={lang}
  title={t('meta.blog.title')}
  description={t('meta.blog.desc')}
  altPath={localizePath(otherLang(lang), '/blog')}
>
  <h1 class="cmd" style="margin-top: 40px;">{t('blog.cmd')}</h1>
  {posts.map((post) => (
    <a
      class="post-row"
      data-branch={post.data.branch}
      href={localizePath(lang, `/blog/${entrySlug(post.id)}`)}
    >
      <span>
        <span class="post-tag">[{post.data.branch}]</span>
        {post.data.title}
      </span>
      <span class="post-date mono">{dateFmt.format(post.data.date)}</span>
    </a>
  ))}
</BaseLayout>
```

- [ ] **Step 2: src/components/pages/BlogPostPage.astro yaz**

```astro
---
import { render } from 'astro:content';
import type { CollectionEntry } from 'astro:content';
import BaseLayout from '../../layouts/BaseLayout.astro';
import { useTranslations, localizePath, otherLang, entrySlug } from '../../i18n/utils';
import type { Lang } from '../../i18n/ui';

interface Props { lang: Lang; post: CollectionEntry<'blog'>; }
const { lang, post } = Astro.props;
const t = useTranslations(lang);
const { Content } = await render(post);
const slug = entrySlug(post.id);

const dateFmt = new Intl.DateTimeFormat(lang === 'tr' ? 'tr-TR' : 'en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});
---
<BaseLayout
  lang={lang}
  title={`${post.data.title} — Efecan Küçük`}
  description={post.data.description}
  altPath={localizePath(otherLang(lang), `/blog/${slug}`)}
>
  <article class="detail" data-branch={post.data.branch}>
    <p style="margin-top: 32px;">
      <a class="mono" href={localizePath(lang, '/blog')}>{t('detail.back')}</a>
    </p>
    <h1>{post.data.title}</h1>
    <div class="stack mono">
      [{post.data.branch}] · {dateFmt.format(post.data.date)}
    </div>
    <div class="prose">
      <Content />
    </div>
  </article>
</BaseLayout>
```

- [ ] **Step 3: EN sayfaları yaz**

`src/pages/blog/index.astro`:

```astro
---
import BlogIndexPage from '../../components/pages/BlogIndexPage.astro';
---
<BlogIndexPage lang="en" />
```

`src/pages/blog/[slug].astro`:

```astro
---
import { getCollection } from 'astro:content';
import BlogPostPage from '../../components/pages/BlogPostPage.astro';
import { entrySlug } from '../../i18n/utils';

export async function getStaticPaths() {
  const posts = await getCollection('blog', (e) => e.id.startsWith('en/'));
  return posts.map((post) => ({
    params: { slug: entrySlug(post.id) },
    props: { post },
  }));
}
const { post } = Astro.props;
---
<BlogPostPage lang="en" post={post} />
```

- [ ] **Step 4: TR sayfaları yaz**

`src/pages/tr/blog/index.astro`:

```astro
---
import BlogIndexPage from '../../../components/pages/BlogIndexPage.astro';
---
<BlogIndexPage lang="tr" />
```

`src/pages/tr/blog/[slug].astro`:

```astro
---
import { getCollection } from 'astro:content';
import BlogPostPage from '../../../components/pages/BlogPostPage.astro';
import { entrySlug } from '../../../i18n/utils';

export async function getStaticPaths() {
  const posts = await getCollection('blog', (e) => e.id.startsWith('tr/'));
  return posts.map((post) => ({
    params: { slug: entrySlug(post.id) },
    props: { post },
  }));
}
const { post } = Astro.props;
---
<BlogPostPage lang="tr" post={post} />
```

- [ ] **Step 5: Build doğrula**

Çalıştır: `npm run build`
Beklenen: hatasız, `18 page(s) built`. `ls dist/blog/why-mad/index.html dist/tr/blog/why-mad/index.html` ikisi de var.

- [ ] **Step 6: Commit**

```bash
git add src/components/pages/Blog* src/pages/blog/ src/pages/tr/blog/
git commit -m "feat: add blog index and post pages"
```

---

### Task 10: 404 sayfası

**Files:**
- Create: `src/pages/404.astro`

- [ ] **Step 1: src/pages/404.astro yaz** (GitHub Pages `404.html`'i otomatik kullanır; sayfa tek ve iki dilli)

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout
  lang="en"
  title="404 — command not found"
  description="Page not found"
  altPath="/tr/"
>
  <section class="terminal mono" style="margin-top: 64px;">
    <div class="prompt">efecan@istanbul ~ $ cd requested-page</div>
    <div style="color: var(--ai);">bash: cd: requested-page: No such file or directory</div>
    <div class="prompt" style="margin-top: 16px;">efecan@istanbul ~ $ git checkout main</div>
    <div style="margin-top: 8px;">
      <a href="/">→ home (EN)</a>
      &nbsp;·&nbsp;
      <a href="/tr/">→ ana sayfa (TR)</a>
    </div>
  </section>
</BaseLayout>
```

- [ ] **Step 2: Build doğrula**

Çalıştır: `npm run build`
Beklenen: hatasız, `19 page(s) built`, `dist/404.html` oluşur.

- [ ] **Step 3: Commit**

```bash
git add src/pages/404.astro
git commit -m "feat: add terminal-style 404 page"
```

---

### Task 11: GitHub Actions deploy + README

**Files:**
- Create: `.github/workflows/deploy.yml`, `README.md`

- [ ] **Step 1: .github/workflows/deploy.yml yaz**

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: withastro/action@v3

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

- [ ] **Step 2: README.md yaz**

````md
# efekck.github.io

Kişisel portfolyo sitesi — [efekck.github.io](https://efekck.github.io). Astro ile
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
````

- [ ] **Step 3: Commit**

```bash
git add .github/ README.md
git commit -m "feat: add GitHub Pages deploy workflow and README"
```

---

### Task 12: Yayına alma ve uçtan uca doğrulama

**Files:** yok (operasyonel task)

- [ ] **Step 1: Tam yerel doğrulama**

```bash
npm test && npm run build
```
Beklenen: testler PASS, build hatasız `19 page(s) built`.

- [ ] **Step 2: Preview üzerinde smoke test**

```bash
npm run preview &
sleep 2
for p in / /tr/ /projects /tr/projects /projects/anomaly-detection-engine /tr/projects/anomaly-detection-engine /about /tr/about /blog /tr/blog /blog/why-mad /tr/blog/why-mad; do
  code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:4321$p")
  echo "$code $p"
done
kill %1
```
Beklenen: tüm satırlar `200`.

- [ ] **Step 3: Kırık link taraması**

```bash
npm run preview &
sleep 2
npx linkinator http://localhost:4321 --recurse --skip "linkedin.com|github.com|mailto:" --silent
kill %1
```
Beklenen: linkinator çıktısında `0 failures` (dış linkler atlanır; `--silent` yalnız kırıkları yazar, hiçbir satır basmaması başarıdır). `/cv.pdf` 404 verirse ve Task 8 fallback'i kullanıldıysa bu bilinen eksiktir — rapora yaz, bloklama.

- [ ] **Step 4: GitHub reposunu oluştur ve push'la**

```bash
gh auth status || echo "GH AUTH YOK — kullanıcıdan 'gh auth login' istenecek"
gh repo create efekck/efekck.github.io --public --source . --push
```
Beklenen: repo oluşur, `main` push'lanır.
**Fallback:** `gh` yoksa veya auth başarısızsa kullanıcıya şu adımları ilet ve dur: (1) github.com'da `efekck.github.io` adında public repo aç, (2) `git remote add origin git@github.com:efekck/efekck.github.io.git && git push -u origin main`.

- [ ] **Step 5: Pages'i workflow kaynağına ayarla**

```bash
gh api -X POST repos/efekck/efekck.github.io/pages -f build_type=workflow 2>/dev/null \
  || gh api -X PUT repos/efekck/efekck.github.io/pages -f build_type=workflow
```
Beklenen: HTTP 201 (POST) veya 204 (PUT).

- [ ] **Step 6: Deploy'un bittiğini doğrula**

```bash
gh run watch --repo efekck/efekck.github.io --exit-status $(gh run list --repo efekck/efekck.github.io --limit 1 --json databaseId -q '.[0].databaseId')
curl -s -o /dev/null -w "%{http_code}" https://efekck.github.io/
curl -s -o /dev/null -w "%{http_code}" https://efekck.github.io/tr/
```
Beklenen: workflow `completed/success`; iki curl da `200`. (İlk yayında DNS/CDN gecikmesi olursa 1-2 dakika bekleyip tekrar dene.)

- [ ] **Step 7: Final commit kontrolü**

```bash
git status --short
```
Beklenen: boş çıktı (her şey commit'li). Boş değilse kalanları uygun mesajla commit'le.

---

## Doğrulama Özeti (Definition of Done)

- `npm test` geçiyor (9 i18n testi)
- `npm run build` hatasız, 19 sayfa
- Preview smoke testinde 12 URL de 200
- linkinator iç linklerde 0 kırık
- `https://efekck.github.io/` ve `/tr/` canlıda 200
- CV butonu çalışıyor (veya bilinen eksik olarak raporlandı)
