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
