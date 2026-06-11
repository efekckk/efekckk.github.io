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
