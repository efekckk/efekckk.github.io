import type { Lang } from '../i18n/ui';

export type BranchKey = 'data' | 'mobile' | 'ai';

export const branchKeys: BranchKey[] = ['data', 'mobile', 'ai'];

export const branches: Record<
  BranchKey,
  { name: string; anchor: string; title: Record<Lang, string>; comment: Record<Lang, string> }
> = {
  data: {
    name: 'data-analytics',
    anchor: 'data-analytics',
    title: { en: 'Data Analytics', tr: 'Veri Analitiği' },
    comment: {
      en: "# full-time at Foneria — dashboards, anomaly detection, SQL",
      tr: "# Foneria'da full-time — dashboard'lar, anomali tespiti, SQL",
    },
  },
  mobile: {
    name: 'mobile-development',
    anchor: 'mobile-development',
    title: { en: 'Mobile Development', tr: 'Mobil Geliştirme' },
    comment: {
      en: '# two platforms in production — SwiftUI & Jetpack Compose',
      tr: '# üretimde iki platform — SwiftUI & Jetpack Compose',
    },
  },
  ai: {
    name: 'ai-engineering',
    anchor: 'ai-engineering',
    title: { en: 'AI Engineering', tr: 'AI Mühendisliği' },
    comment: {
      en: '# RAG, MCP, multi-agent — the branch pointed at the future',
      tr: '# RAG, MCP, multi-agent — geleceğe açılan branch',
    },
  },
};
