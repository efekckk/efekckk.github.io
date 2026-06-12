import { describe, it, expect } from 'vitest';
import {
  getLangFromUrl,
  useTranslations,
  localizePath,
  otherLang,
  entryLang,
  entrySlug,
} from '../src/i18n/utils';

describe('getLangFromUrl', () => {
  it('returns tr for /tr/ paths', () => {
    expect(getLangFromUrl(new URL('https://efekckk.github.io/tr/projects'))).toBe('tr');
  });
  it('returns en for root paths', () => {
    expect(getLangFromUrl(new URL('https://efekckk.github.io/projects'))).toBe('en');
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

describe('otherLang', () => {
  it('returns the opposite language', () => {
    expect(otherLang('en')).toBe('tr');
    expect(otherLang('tr')).toBe('en');
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
